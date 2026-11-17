import { toSlug } from "@/constants/journalPage";
import type { Journal } from "@/lib/journalService";

export const JOURNAL_CATEGORIES = [
  "News",
  "Events",
  "Projects",
  "General",
  "Energy",
] as const;

export type JournalStatus = "draft" | "published";

export type JournalRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  subtext: string | null;
  cover_url: string | null;
  gallery_urls: string[] | null;
  status: JournalStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type JournalRecord = Journal & {
  status: JournalStatus;
  publishedAt: string | null;
};

export type JournalInput = {
  title: string;
  slug?: string;
  category?: string;
  excerpt: string;
  body: string;
  subtext?: string | null;
  cover?: string | null;
  gallery?: string[];
  status?: JournalStatus;
  publishedAt?: string | null;
};

export function slugify(value: string) {
  return toSlug(value);
}

export function formatJournalDate(input?: string | null) {
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

export function journalRecentTimestamp(item: {
  publishedAt?: string | null;
  updatedAt: string;
  createdAt: string;
}) {
  const raw = item.publishedAt || item.updatedAt || item.createdAt;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortJournalsByRecent<
  T extends {
    publishedAt?: string | null;
    updatedAt: string;
    createdAt: string;
  },
>(items: T[]) {
  return [...items].sort(
    (a, b) => journalRecentTimestamp(b) - journalRecentTimestamp(a)
  );
}

export function mapJournalRow(row: JournalRow): JournalRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: formatJournalDate(row.published_at || row.created_at),
    cover: row.cover_url || "/journals/default.png",
    excerpt: row.excerpt,
    body: row.body,
    subtext: row.subtext ?? undefined,
    gallery: row.gallery_urls ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    publishedAt: row.published_at,
  };
}
