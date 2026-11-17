import { unstable_cache } from "next/cache";
import type { Journal } from "@/lib/journalService";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  isSupabaseConfigured,
  isSupabasePublicConfigured,
} from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { PAM_AFRICA_JOURNALS } from "@/lib/supabase/tables";
import { journalArticles, type Article } from "@/constants/journalPage";
import { deleteJournalMediaForRecord } from "@/lib/journalMedia";
import {
  mapJournalRow,
  slugify,
  sortJournalsByRecent,
  type JournalInput,
  type JournalRecord,
  type JournalRow,
} from "@/lib/journalTypes";

export {
  JOURNAL_CATEGORIES,
  formatJournalDate,
  mapJournalRow,
  slugify,
  type JournalInput,
  type JournalRecord,
  type JournalRow,
  type JournalStatus,
  sortJournalsByRecent,
} from "@/lib/journalTypes";

export function articleToJournal(article: Article): Journal {
  return {
    id: article.slug || slugify(article.title),
    slug: article.slug || slugify(article.title),
    title: article.title,
    category: article.category,
    date: article.date,
    cover: article.cover,
    excerpt: article.excerpt,
    body: article.body,
    subtext: article.subtext,
    gallery: article.gallery,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function localJournals(): Journal[] {
  return journalArticles.map(articleToJournal);
}

export function getLocalJournalBySlug(slug: string): Journal | null {
  return localJournals().find((item) => item.slug === slug) ?? null;
}

export function requireSupabaseAdmin() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured");
  }
  return createSupabaseAdminClient();
}

const PUBLISHED_LIST_COLUMNS =
  "id, slug, title, category, excerpt, subtext, cover_url, gallery_urls, status, published_at, created_at, updated_at";

async function fetchPublishedFromSupabase() {
  const supabase = isSupabaseConfigured()
    ? createSupabaseAdminClient()
    : createSupabasePublicClient();

  return supabase
    .from(PAM_AFRICA_JOURNALS)
    .select(PUBLISHED_LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
}

async function listPublishedJournalsUncached(): Promise<Journal[]> {
  if (!isSupabaseConfigured() && !isSupabasePublicConfigured()) {
    return localJournals();
  }

  const { data, error } = await fetchPublishedFromSupabase();

  if (error) {
    console.error("Failed to list published journals:", error);
    return localJournals();
  }

  return ((data ?? []) as JournalRow[]).map((row) =>
    mapJournalRow({ ...row, body: "" })
  );
}

export async function listPublishedJournals(): Promise<Journal[]> {
  if (!isSupabaseConfigured() && !isSupabasePublicConfigured()) {
    return localJournals();
  }
  return unstable_cache(listPublishedJournalsUncached, ["pam-published-journals"], {
    revalidate: 60,
    tags: ["journals"],
  })();
}

export async function getPublishedJournalBySlug(
  slug: string
): Promise<Journal | null> {
  if (!isSupabaseConfigured() && !isSupabasePublicConfigured()) {
    return getLocalJournalBySlug(slug);
  }

  const supabase = isSupabaseConfigured()
    ? createSupabaseAdminClient()
    : createSupabasePublicClient();
  const { data, error } = await supabase
    .from(PAM_AFRICA_JOURNALS)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch journal:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapJournalRow(data as JournalRow);
}

export async function listAllJournals(): Promise<JournalRecord[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_JOURNALS)
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return sortJournalsByRecent(
    ((data ?? []) as JournalRow[]).map(mapJournalRow)
  );
}

export async function getJournalById(id: string): Promise<JournalRecord | null> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_JOURNALS)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapJournalRow(data as JournalRow) : null;
}

export async function getJournalBySlugAny(
  slug: string
): Promise<JournalRecord | null> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_JOURNALS)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapJournalRow(data as JournalRow) : null;
}

function nextPublishedAt(input: JournalInput, existing?: JournalRecord | null) {
  if (input.status === "draft") return input.publishedAt ?? null;
  if (input.publishedAt) return input.publishedAt;
  if (existing?.publishedAt) return existing.publishedAt;
  return new Date().toISOString();
}

export async function createJournalRecord(input: JournalInput) {
  const supabase = requireSupabaseAdmin();
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
  const status = input.status ?? "draft";

  const { data, error } = await supabase
    .from(PAM_AFRICA_JOURNALS)
    .insert({
      slug,
      title: input.title.trim(),
      category: input.category || "General",
      excerpt: input.excerpt,
      body: input.body,
      subtext: input.subtext || null,
      cover_url: input.cover || null,
      gallery_urls: input.gallery ?? [],
      status,
      published_at: nextPublishedAt({ ...input, status }),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapJournalRow(data as JournalRow);
}

export async function updateJournalRecord(slug: string, input: JournalInput) {
  const existing = await getJournalBySlugAny(slug);
  if (!existing) {
    throw new Error("Journal not found");
  }

  const nextSlug = input.slug?.trim() ? slugify(input.slug) : existing.slug;
  const status = input.status ?? existing.status;

  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_JOURNALS)
    .update({
      slug: nextSlug,
      title: input.title.trim(),
      category: input.category || existing.category,
      excerpt: input.excerpt,
      body: input.body,
      subtext: input.subtext || null,
      cover_url: input.cover || null,
      gallery_urls: input.gallery ?? [],
      status,
      published_at: nextPublishedAt({ ...input, status }, existing),
    })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapJournalRow(data as JournalRow);
}

export async function deleteJournalRecord(slug: string) {
  const existing = await getJournalBySlugAny(slug);
  if (!existing) {
    throw new Error("Journal not found");
  }

  try {
    await deleteJournalMediaForRecord(existing);
  } catch (err) {
    console.error("Journal media cleanup failed:", err);
  }

  const supabase = requireSupabaseAdmin();
  const { error } = await supabase
    .from(PAM_AFRICA_JOURNALS)
    .delete()
    .eq("slug", slug);
  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertJournalBySlug(input: JournalInput & { slug: string }) {
  const existing = await getJournalBySlugAny(input.slug);
  if (existing) {
    return updateJournalRecord(input.slug, input);
  }
  return createJournalRecord(input);
}

export async function countJournals() {
  const rows = await listAllJournals();
  return {
    total: rows.length,
    published: rows.filter((row) => row.status === "published").length,
    drafts: rows.filter((row) => row.status === "draft").length,
  };
}
