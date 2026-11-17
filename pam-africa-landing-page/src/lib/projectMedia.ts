import type { ProjectRecord } from "@/lib/projectTypes";
import {
  deleteStoragePath,
  storagePathFromPublicUrl,
} from "@/lib/storageMedia";

export { storagePathFromPublicUrl, isSanityCdnUrl } from "@/lib/storageMedia";

export function collectProjectMediaUrls(
  project: Pick<ProjectRecord, "cover" | "gallery">
) {
  const urls = new Set<string>();
  if (project.cover) urls.add(project.cover);
  for (const item of project.gallery ?? []) {
    if (item) urls.add(item);
  }
  return [...urls];
}

export function collectProjectStoragePaths(
  project: Pick<ProjectRecord, "cover" | "gallery">
) {
  const paths = new Set<string>();
  for (const url of collectProjectMediaUrls(project)) {
    const path = storagePathFromPublicUrl(url);
    if (path) paths.add(path);
  }
  return [...paths];
}

export async function removeProjectStoragePaths(paths: string[]) {
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

export async function deleteProjectMediaForRecord(project: ProjectRecord) {
  const paths = collectProjectStoragePaths(project);
  if (paths.length === 0) return { removed: 0 };
  return removeProjectStoragePaths(paths);
}
