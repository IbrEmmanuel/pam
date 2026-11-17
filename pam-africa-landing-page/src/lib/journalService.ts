import {
  getPublishedJournalBySlug,
  listPublishedJournals,
} from "@/lib/journals";
import { getDefaultSiteUrl } from "@/lib/siteUrl";

export interface Journal {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  cover: string;
  excerpt: string;
  body: string;
  subtext?: string;
  gallery?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalsResponse {
  success: boolean;
  data: Journal[];
  total: number;
}

export interface JournalResponse {
  success: boolean;
  data: Journal;
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return getDefaultSiteUrl();
}

export async function fetchJournals(): Promise<Journal[]> {
  try {
    if (typeof window === "undefined") {
      return listPublishedJournals();
    }

    const response = await fetch(`${getBaseUrl()}/api/journals`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: JournalsResponse = await response.json();
    if (!result.success) {
      throw new Error("Failed to fetch journals");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching journals:", error);
    return listPublishedJournals();
  }
}

export async function fetchJournalBySlug(
  slug: string
): Promise<Journal | null> {
  try {
    if (typeof window === "undefined") {
      return getPublishedJournalBySlug(slug);
    }

    const response = await fetch(`${getBaseUrl()}/api/journals/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: JournalResponse = await response.json();
    if (!result.success) {
      throw new Error("Failed to fetch journal");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching journal:", error);
    return getPublishedJournalBySlug(slug);
  }
}

export async function createJournal(
  journalData: Partial<Journal> & { status?: "draft" | "published" }
): Promise<Journal> {
  const response = await fetch(`${getBaseUrl()}/api/journals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(journalData),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create journal");
  }

  return result.data;
}

export async function updateJournal(
  slug: string,
  journalData: Partial<Journal> & { status?: "draft" | "published" }
): Promise<Journal> {
  const response = await fetch(`${getBaseUrl()}/api/journals/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(journalData),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update journal");
  }

  return result.data;
}

export async function deleteJournal(slug: string): Promise<void> {
  const response = await fetch(`${getBaseUrl()}/api/journals/${slug}`, {
    method: "DELETE",
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete journal");
  }
}
