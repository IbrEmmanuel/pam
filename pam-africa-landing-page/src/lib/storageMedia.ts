import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { JOURNAL_MEDIA_BUCKET } from "@/lib/supabase/env";

export const MEDIA_FOLDERS = [
  "covers",
  "gallery",
  "body",
  "media",
  "sanity",
  "local",
] as const;

const ALLOWED_PREFIXES = MEDIA_FOLDERS.map((f) => `${f}/`);

export function normalizeStoragePath(path: string): string {
  const trimmed = path.trim().replace(/^\/+/, "");
  if (!trimmed || trimmed.includes("..")) {
    throw new Error("Invalid file path");
  }
  if (!ALLOWED_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
    throw new Error("Invalid file path");
  }
  return trimmed;
}

export function storagePathFromPublicUrl(url: string): string | null {
  if (!url?.trim()) return null;
  if (!url.includes("://") && url.startsWith("sanity/")) {
    return normalizeStoragePath(url);
  }
  try {
    const parsed = new URL(url);
    const publicMarker = `/object/public/${JOURNAL_MEDIA_BUCKET}/`;
    const signedMarker = `/object/sign/${JOURNAL_MEDIA_BUCKET}/`;
    let idx = parsed.pathname.indexOf(publicMarker);
    let offset = publicMarker.length;
    if (idx === -1) {
      idx = parsed.pathname.indexOf(signedMarker);
      offset = signedMarker.length;
    }
    if (idx === -1) return null;
    const raw = decodeURIComponent(parsed.pathname.slice(idx + offset));
    try {
      return normalizeStoragePath(raw);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export function isSanityCdnUrl(url: string) {
  return /cdn\.sanity\.io|sanity\.io\/images/i.test(url);
}

async function listFolderFiles(folder: string) {
  const supabase = createSupabaseAdminClient();
  const paths: string[] = [];
  const limit = 200;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase.storage
      .from(JOURNAL_MEDIA_BUCKET)
      .list(folder, {
        limit,
        offset,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      throw new Error(error.message);
    }

    const batch = data ?? [];
    if (batch.length === 0) break;

    for (const item of batch) {
      if (!item.name || item.name.startsWith(".")) continue;
      if (item.id === null && !item.metadata) continue;
      paths.push(`${folder}/${item.name}`);
    }

    if (batch.length < limit) break;
    offset += limit;
  }

  return paths;
}

export async function listAllBucketMedia() {
  const supabase = createSupabaseAdminClient();
  const paths: string[] = [];

  for (const folder of MEDIA_FOLDERS) {
    try {
      paths.push(...(await listFolderFiles(folder)));
    } catch {
      continue;
    }
  }

  return paths.map((path) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(JOURNAL_MEDIA_BUCKET).getPublicUrl(path);
    const name = path.split("/").pop() ?? path;
    return { name, path, url: publicUrl };
  });
}

export async function deleteStoragePath(path: string) {
  const normalized = normalizeStoragePath(path);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(JOURNAL_MEDIA_BUCKET)
    .remove([normalized]);

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.length) {
    throw new Error("File not found or could not be deleted");
  }

  return normalized;
}
