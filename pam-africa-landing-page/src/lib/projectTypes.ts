import { toSlug } from "@/constants/journalPage";
import type { Project } from "@/constants/projects";

export const PROJECT_TYPES = [
  "Energy",
  "Infrastructure",
  "Innovation",
  "Media",
  "General",
] as const;

export type ProjectStatus = "draft" | "published";

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  year: string;
  blurb: string;
  cover_url: string | null;
  gallery_urls: string[] | null;
  info: string;
  project_type: string;
  featured: boolean;
  sort_order: number;
  status: ProjectStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectRecord = Project & {
  id: string;
  type: string;
  featured: boolean;
  sortOrder: number;
  status: ProjectStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = {
  title: string;
  slug?: string;
  year?: string | number;
  blurb?: string;
  cover?: string | null;
  gallery?: string[];
  info?: string;
  type?: string;
  featured?: boolean;
  sortOrder?: number;
  status?: ProjectStatus;
  publishedAt?: string | null;
};

export function slugify(value: string) {
  return toSlug(value);
}

export function formatProjectDate(input?: string | null) {
  const date = input ? new Date(input) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function projectRecentTimestamp(item: {
  publishedAt?: string | null;
  updatedAt: string;
  createdAt: string;
}) {
  const raw = item.publishedAt || item.updatedAt || item.createdAt;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortProjectsByRecent<
  T extends {
    publishedAt?: string | null;
    updatedAt: string;
    createdAt: string;
    sortOrder?: number;
  },
>(items: T[]) {
  return [...items].sort((a, b) => {
    const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return projectRecentTimestamp(b) - projectRecentTimestamp(a);
  });
}

export function mapProjectRow(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    blurb: row.blurb,
    cover: row.cover_url || "/projects/solar-roof.png",
    gallery: row.gallery_urls ?? [],
    info: row.info,
    type: row.project_type || "Energy",
    featured: Boolean(row.featured),
    sortOrder: row.sort_order ?? 0,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function projectToPublic(project: ProjectRecord): Project {
  return {
    slug: project.slug,
    title: project.title,
    year: project.year,
    blurb: project.blurb,
    cover: project.cover,
    gallery: project.gallery,
    info: project.info,
  };
}
