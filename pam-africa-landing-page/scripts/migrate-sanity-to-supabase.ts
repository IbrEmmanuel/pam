import { createClient } from "@supabase/supabase-js";
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

const ROOT = process.cwd();
const EXPORT_DIR = join(ROOT, "migration", "sanity-export");
const ASSET_DIR = join(EXPORT_DIR, "assets");
const BUCKET = "pam-africa-journal-media";

type SanityAsset = {
  _id?: string;
  url?: string;
  originalFilename?: string;
};

type SanityDoc = {
  _id: string;
  _type?: string;
  _updatedAt?: string;
  _createdAt?: string;
  title?: string;
  slug?: string;
  category?: string;
  date?: string;
  publishedAt?: string;
  excerpt?: string;
  subtext?: string;
  body?: unknown;
  coverAsset?: SanityAsset | null;
  galleryAssets?: SanityAsset[] | null;
};

type PortableBlock = {
  _type?: string;
  style?: string;
  listItem?: string;
  children?: Array<{ text?: string; marks?: string[] }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  asset?: SanityAsset;
  alt?: string;
};

type LocalArticle = {
  slug?: string;
  title: string;
  category: string;
  date: string;
  cover: string;
  excerpt: string;
  body: string;
  subtext?: string;
  gallery?: string[];
};

type ReportRow = {
  slug: string;
  source: "sanity" | "local";
  title: boolean;
  bodyChars: number;
  cover: boolean;
  gallery: number;
  imagesOk: boolean;
  errors: string[];
};

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = join(ROOT, file);
    if (!existsSync(path)) continue;
    for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const index = line.indexOf("=");
      if (index === -1) continue;
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char] ?? char;
  });
}

function portableTextToHtml(
  blocks: unknown,
  rewrite: (url: string) => string
): string {
  if (!Array.isArray(blocks)) {
    return typeof blocks === "string" ? blocks : "";
  }

  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  const renderChildren = (block: PortableBlock) => {
    return (block.children ?? [])
      .map((child) => {
        let text = (child.text || "").replace(/\n/g, "<br />");
        for (const mark of child.marks ?? []) {
          if (mark === "strong") text = `<strong>${text}</strong>`;
          else if (mark === "em") text = `<em>${text}</em>`;
          else if (mark === "code") text = `<code>${text}</code>`;
          else {
            const def = (block.markDefs ?? []).find((item) => item._key === mark);
            if (def?.href) text = `<a href="${escapeHtml(def.href)}">${text}</a>`;
          }
        }
        return text;
      })
      .join("");
  };

  for (const raw of blocks as PortableBlock[]) {
    if (raw._type === "image") {
      closeList();
      const url = raw.asset?.url ? rewrite(raw.asset.url) : "";
      if (url) html.push(`<img src="${url}" alt="${raw.alt || ""}" />`);
      continue;
    }

    if (raw._type !== "block") continue;
    const children = renderChildren(raw);
    if (raw.listItem) {
      const next = raw.listItem === "number" ? "ol" : "ul";
      if (listType && listType !== next) closeList();
      if (!listType) {
        html.push(`<${next}>`);
        listType = next;
      }
      if (children.trim()) html.push(`<li>${children}</li>`);
      continue;
    }

    closeList();
    if (!children.trim()) continue;
    const style = raw.style || "normal";
    if (style === "h1" || style === "h2" || style === "h3" || style === "h4") {
      html.push(`<${style}>${children}</${style}>`);
    } else if (style === "blockquote") {
      html.push(`<blockquote>${children}</blockquote>`);
    } else {
      html.push(`<p>${children}</p>`);
    }
  }

  closeList();
  return html.join("\n");
}

async function fetchSanityDocs(): Promise<SanityDoc[]> {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    process.env.SANITY_API_VERSION ||
    "2024-01-01";
  const token = process.env.SANITY_READ_TOKEN;

  if (!projectId || !dataset) {
    console.log("Sanity env not set — skipping live Sanity export.");
    return [];
  }

  const query = `*[_type in ["journal", "article", "post"]] | order(_updatedAt desc){
    _id,
    _type,
    _updatedAt,
    _createdAt,
    title,
    "slug": coalesce(slug.current, slug),
    category,
    date,
    publishedAt,
    excerpt,
    subtext,
    body[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{ _id, url, originalFilename }
      }
    },
    "coverAsset": coalesce(cover.asset, mainImage.asset, thumbnail.asset)->{ _id, url, originalFilename },
    "galleryAssets": coalesce(gallery[].asset, images[].asset)->{ _id, url, originalFilename }
  }`;

  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
  );
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", token ? "raw" : "published");

  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Sanity export failed: ${response.status} ${await response.text()}`);
  }

  const json = (await response.json()) as { result?: SanityDoc[] };
  return json.result ?? [];
}

function collectAssets(doc: SanityDoc): SanityAsset[] {
  const assets: SanityAsset[] = [];
  if (doc.coverAsset?.url) assets.push(doc.coverAsset);
  for (const asset of doc.galleryAssets ?? []) {
    if (asset?.url) assets.push(asset);
  }
  if (Array.isArray(doc.body)) {
    for (const block of doc.body as PortableBlock[]) {
      if (block?._type === "image" && block.asset?.url) {
        assets.push(block.asset);
      }
    }
  }
  return assets;
}

async function downloadFile(url: string, dest: string) {
  if (existsSync(dest)) return dest;
  ensureDir(dirname(dest));
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Download failed ${response.status} ${url}`);
  }
  const nodeStream = Readable.fromWeb(response.body as never);
  await pipeline(nodeStream, createWriteStream(dest));
  return dest;
}

function assetKey(asset: SanityAsset) {
  const id = (asset._id || asset.url || "unknown")
    .replace(/^image-/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-");
  const ext =
    asset.originalFilename?.split(".").pop() ||
    asset.url?.split(".").pop()?.split("?")[0] ||
    "bin";
  return `sanity/${id}.${ext}`;
}

function localPathFromPublic(url: string) {
  if (!url.startsWith("/")) return null;
  const path = join(ROOT, "public", url.replace(/^\//, ""));
  return existsSync(path) ? path : null;
}

async function uploadIfNeeded(
  supabase: {
    storage: {
      from: (bucket: string) => {
        list: (
          path: string,
          options?: { search?: string }
        ) => Promise<{ data: Array<{ name: string }> | null }>;
        upload: (
          path: string,
          file: Buffer,
          options: { contentType?: string; upsert?: boolean }
        ) => Promise<{ error: { message: string } | null }>;
        getPublicUrl: (path: string) => { data: { publicUrl: string } };
      };
    };
  },
  storagePath: string,
  filePath: string,
  contentType?: string
) {
  const { data: existing } = await supabase.storage.from(BUCKET).list(
    dirname(storagePath) === "." ? "" : dirname(storagePath),
    { search: storagePath.split("/").pop() }
  );
  const already = existing?.some((item) => `${dirname(storagePath)}/${item.name}` === storagePath || item.name === storagePath.split("/").pop());
  if (!already) {
    const bytes = readFileSync(filePath);
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, bytes, {
      contentType: contentType || "application/octet-stream",
      upsert: true,
    });
    if (error && !error.message.toLowerCase().includes("already")) {
      throw new Error(`Upload failed ${storagePath}: ${error.message}`);
    }
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return publicUrl;
}

async function headOk(url: string) {
  if (url.startsWith("/")) {
    return existsSync(join(ROOT, "public", url.replace(/^\//, "")));
  }
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (response.ok) return true;
    const get = await fetch(url, { method: "GET" });
    return get.ok;
  } catch {
    return false;
  }
}

function loadLocalArticles(): LocalArticle[] {
  const source = readFileSync(join(ROOT, "src/constants/journalPage.ts"), "utf8");
  const match = source.match(/export const journalArticles[\s\S]*?=\s*(\[[\s\S]*?\n\]);/);
  if (!match) return [];
  try {
    return new Function(`return ${match[1]}`)() as LocalArticle[];
  } catch {
    return [];
  }
}

async function main() {
  loadEnv();
  ensureDir(ASSET_DIR);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local first."
    );
  }

  const supabase = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((bucket) => bucket.id === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) {
      throw new Error(
        `Could not create ${BUCKET} bucket: ${error.message}. Run supabase/migrations/001_journals.sql first.`
      );
    }
  }

  const sanityDocs = await fetchSanityDocs();
  writeFileSync(join(EXPORT_DIR, "sanity-docs.json"), JSON.stringify(sanityDocs, null, 2));
  console.log(`Exported ${sanityDocs.length} Sanity document(s).`);

  const publishedBySlug = new Map<string, SanityDoc>();
  const draftsBySlug = new Map<string, SanityDoc>();
  for (const doc of sanityDocs) {
    const slug = doc.slug || slugify(doc.title || doc._id);
    if (!slug) continue;
    if (doc._id.startsWith("drafts.")) draftsBySlug.set(slug, doc);
    else publishedBySlug.set(slug, doc);
  }

  const urlMap = new Map<string, string>();
  const allDocs = [...publishedBySlug.values(), ...draftsBySlug.values()];
  for (const doc of allDocs) {
    for (const asset of collectAssets(doc)) {
      if (!asset.url) continue;
      const key = assetKey(asset);
      const dest = join(ASSET_DIR, key.replaceAll("/", "_"));
      await downloadFile(asset.url, dest);
      urlMap.set(asset.url, await uploadIfNeeded(supabase, key, dest, "image/png"));
    }
  }

  const rewrite = (original: string) => urlMap.get(original) || original;
  const report: ReportRow[] = [];
  const usedSlugs = new Set<string>();

  const upsert = async (payload: {
    slug: string;
    title: string;
    category: string;
    excerpt: string;
    body: string;
    subtext?: string | null;
    cover?: string | null;
    gallery: string[];
    status: "draft" | "published";
    publishedAt?: string | null;
    source: "sanity" | "local";
  }) => {
    const { error } = await supabase.from("pam_africa_journals").upsert(
      {
        slug: payload.slug,
        title: payload.title,
        category: payload.category || "General",
        excerpt: payload.excerpt || "",
        body: payload.body || "",
        subtext: payload.subtext || null,
        cover_url: payload.cover || null,
        gallery_urls: payload.gallery,
        status: payload.status,
        published_at: payload.publishedAt,
      },
      { onConflict: "slug" }
    );
    if (error) {
      throw new Error(`Upsert failed for ${payload.slug}: ${error.message}`);
    }
    usedSlugs.add(payload.slug);
    const imageUrls = [payload.cover, ...payload.gallery].filter(Boolean) as string[];
    const imagesOk = (
      await Promise.all(imageUrls.map((image) => headOk(image)))
    ).every(Boolean);
    report.push({
      slug: payload.slug,
      source: payload.source,
      title: Boolean(payload.title),
      bodyChars: payload.body.length,
      cover: Boolean(payload.cover),
      gallery: payload.gallery.length,
      imagesOk,
      errors: imagesOk ? [] : ["One or more images failed HTTP check"],
    });
  };

  for (const [slug, published] of publishedBySlug) {
    const gallery = (published.galleryAssets ?? [])
      .map((asset) => (asset.url ? rewrite(asset.url) : ""))
      .filter(Boolean);
    await upsert({
      slug,
      title: published.title || "Untitled",
      category: typeof published.category === "string" ? published.category : "General",
      excerpt: published.excerpt || "",
      body: portableTextToHtml(published.body, rewrite),
      subtext: published.subtext,
      cover: published.coverAsset?.url ? rewrite(published.coverAsset.url) : null,
      gallery,
      status: "published",
      publishedAt: published.date || published.publishedAt || published._createdAt || null,
      source: "sanity",
    });
  }

  for (const [slug, draft] of draftsBySlug) {
    if (publishedBySlug.has(slug)) continue;
    const gallery = (draft.galleryAssets ?? [])
      .map((asset) => (asset.url ? rewrite(asset.url) : ""))
      .filter(Boolean);
    await upsert({
      slug,
      title: draft.title || "Untitled",
      category: typeof draft.category === "string" ? draft.category : "General",
      excerpt: draft.excerpt || "",
      body: portableTextToHtml(draft.body, rewrite),
      subtext: draft.subtext,
      cover: draft.coverAsset?.url ? rewrite(draft.coverAsset.url) : null,
      gallery,
      status: "draft",
      publishedAt: draft.date || draft.publishedAt || null,
      source: "sanity",
    });
  }

  const localArticles = loadLocalArticles();
  writeFileSync(join(EXPORT_DIR, "local-articles.json"), JSON.stringify(localArticles, null, 2));

  for (const article of localArticles) {
    const slug = article.slug || slugify(article.title);
    if (usedSlugs.has(slug)) continue;

    const gallery: string[] = [];
    for (const image of article.gallery ?? []) {
      const local = localPathFromPublic(image);
      if (local) {
        gallery.push(await uploadIfNeeded(supabase, `local/${image.replace(/^\//, "")}`, local));
      } else {
        gallery.push(image);
      }
    }

    let cover = article.cover;
    const coverLocal = localPathFromPublic(article.cover);
    if (coverLocal) {
      cover = await uploadIfNeeded(
        supabase,
        `local/${article.cover.replace(/^\//, "")}`,
        coverLocal
      );
    }

    await upsert({
      slug,
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      body: article.body,
      subtext: article.subtext,
      cover,
      gallery,
      status: "published",
      publishedAt: article.date ? new Date(article.date).toISOString() : new Date().toISOString(),
      source: "local",
    });
  }

  const { count, error: countError } = await supabase
    .from("pam_africa_journals")
    .select("id", { count: "exact", head: true });
  if (countError) {
    throw new Error(`Verification count failed: ${countError.message}`);
  }

  const expected = usedSlugs.size;
  const failed = report.filter((row) => !row.title || !row.imagesOk);
  const summary = {
    sanityDocuments: sanityDocs.length,
    migrated: report.length,
    supabaseCount: count ?? 0,
    expected,
    failed: failed.length,
    rows: report,
  };
  writeFileSync(join(EXPORT_DIR, "verification-report.json"), JSON.stringify(summary, null, 2));

  console.log("\nMigration report");
  console.log("----------------");
  console.log(`Sanity documents: ${summary.sanityDocuments}`);
  console.log(`Rows upserted:    ${summary.migrated}`);
  console.log(`Supabase count:   ${summary.supabaseCount}`);
  for (const row of report) {
    console.log(
      `- ${row.slug} [${row.source}] title=${row.title} body=${row.bodyChars} cover=${row.cover} gallery=${row.gallery} images=${row.imagesOk ? "ok" : "FAIL"}`
    );
  }

  if (failed.length > 0 || (count ?? 0) < expected) {
    throw new Error(
      `Migration verification failed. See ${join(EXPORT_DIR, "verification-report.json")}`
    );
  }

  console.log("\nVerification green. Safe to keep using /admin and remove Sanity.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
