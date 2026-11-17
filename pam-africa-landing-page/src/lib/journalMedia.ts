import type { JournalRecord } from "@/lib/journalTypes";
import {
  deleteStoragePath,
  storagePathFromPublicUrl,
} from "@/lib/storageMedia";

const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/gi;

export { storagePathFromPublicUrl, isSanityCdnUrl } from "@/lib/storageMedia";

export function collectJournalMediaUrls(
  journal: Pick<JournalRecord, "cover" | "gallery" | "body">
) {
  const urls = new Set<string>();
  if (journal.cover) urls.add(journal.cover);
  for (const item of journal.gallery ?? []) {
    if (item) urls.add(item);
  }
  let match: RegExpExecArray | null;
  const body = journal.body ?? "";
  while ((match = IMG_SRC_RE.exec(body)) !== null) {
    if (match[1]) urls.add(match[1]);
  }
  return [...urls];
}

export function collectJournalStoragePaths(
  journal: Pick<JournalRecord, "cover" | "gallery" | "body">
) {
  const paths = new Set<string>();
  for (const url of collectJournalMediaUrls(journal)) {
    const path = storagePathFromPublicUrl(url);
    if (path) paths.add(path);
  }
  return [...paths];
}

export async function removeJournalStoragePaths(paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))];
  let removed = 0;
  for (const path of unique) {
    try {
      await deleteStoragePath(path);
      removed += 1;
    } catch (err) {
      console.error(`Failed to remove ${path}:`, err);
    }
  }
  return { removed };
}

export async function deleteJournalMediaForRecord(journal: JournalRecord) {
  const paths = collectJournalStoragePaths(journal);
  if (paths.length === 0) return { removed: 0 };
  return removeJournalStoragePaths(paths);
}
