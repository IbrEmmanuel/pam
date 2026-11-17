import { unstable_cache } from "next/cache";
import { projects as localProjectSeed } from "@/constants/projects";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  isSupabaseConfigured,
  isSupabasePublicConfigured,
} from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { PAM_AFRICA_PROJECTS } from "@/lib/supabase/tables";
import { deleteProjectMediaForRecord } from "@/lib/projectMedia";
import {
  mapProjectRow,
  projectToPublic,
  slugify,
  sortProjectsByRecent,
  type ProjectInput,
  type ProjectRecord,
  type ProjectRow,
} from "@/lib/projectTypes";
import type { Project } from "@/constants/projects";

export {
  PROJECT_TYPES,
  formatProjectDate,
  mapProjectRow,
  projectToPublic,
  slugify,
  type ProjectInput,
  type ProjectRecord,
  type ProjectRow,
  type ProjectStatus,
  sortProjectsByRecent,
} from "@/lib/projectTypes";

export function localProjects(): ProjectRecord[] {
  return localProjectSeed.map((item, index) => ({
    id: item.slug,
    slug: item.slug,
    title: item.title,
    year: String(item.year),
    blurb: item.blurb ?? "",
    cover: item.cover,
    gallery: item.gallery,
    info: item.info ?? "",
    type: "Energy",
    featured: true,
    sortOrder: index,
    status: "published" as const,
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

export function getLocalProjectBySlug(slug: string): ProjectRecord | null {
  return localProjects().find((item) => item.slug === slug) ?? null;
}

export function requireSupabaseAdmin() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured");
  }
  return createSupabaseAdminClient();
}

const PUBLISHED_LIST_COLUMNS =
  "id, slug, title, year, blurb, cover_url, gallery_urls, info, project_type, featured, sort_order, status, published_at, created_at, updated_at";

async function fetchPublishedFromSupabase() {
  const supabase = isSupabaseConfigured()
    ? createSupabaseAdminClient()
    : createSupabasePublicClient();

  return supabase
    .from(PAM_AFRICA_PROJECTS)
    .select(PUBLISHED_LIST_COLUMNS)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false, nullsFirst: false });
}

async function listPublishedProjectsUncached(): Promise<ProjectRecord[]> {
  if (!isSupabaseConfigured() && !isSupabasePublicConfigured()) {
    return localProjects();
  }

  const { data, error } = await fetchPublishedFromSupabase();

  if (error) {
    console.error("Failed to list published projects:", error);
    return localProjects();
  }

  const rows = ((data ?? []) as ProjectRow[]).map(mapProjectRow);
  return rows.length > 0 ? rows : localProjects();
}

export async function listPublishedProjects(): Promise<ProjectRecord[]> {
  if (!isSupabaseConfigured() && !isSupabasePublicConfigured()) {
    return localProjects();
  }
  return unstable_cache(
    listPublishedProjectsUncached,
    ["pam-published-projects"],
    {
      revalidate: 60,
      tags: ["projects"],
    }
  )();
}

export async function listPublishedProjectsPublic(): Promise<Project[]> {
  const rows = await listPublishedProjects();
  return rows.map(projectToPublic);
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<ProjectRecord | null> {
  if (!isSupabaseConfigured() && !isSupabasePublicConfigured()) {
    return getLocalProjectBySlug(slug);
  }

  const supabase = isSupabaseConfigured()
    ? createSupabaseAdminClient()
    : createSupabasePublicClient();
  const { data, error } = await supabase
    .from(PAM_AFRICA_PROJECTS)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch project:", error);
    return getLocalProjectBySlug(slug);
  }

  if (!data) {
    return getLocalProjectBySlug(slug);
  }

  return mapProjectRow(data as ProjectRow);
}

export async function listFeaturedProjects(): Promise<ProjectRecord[]> {
  const all = await listPublishedProjects();
  const featured = all.filter((item) => item.featured);
  return featured.length > 0 ? featured : all.slice(0, 5);
}

export async function listAllProjects(): Promise<ProjectRecord[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_PROJECTS)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return sortProjectsByRecent(
    ((data ?? []) as ProjectRow[]).map(mapProjectRow)
  );
}

export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_PROJECTS)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProjectRow(data as ProjectRow) : null;
}

export async function getProjectBySlugAny(
  slug: string
): Promise<ProjectRecord | null> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_PROJECTS)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProjectRow(data as ProjectRow) : null;
}

function nextPublishedAt(input: ProjectInput, existing?: ProjectRecord | null) {
  if (input.status === "draft") return input.publishedAt ?? null;
  if (input.publishedAt) return input.publishedAt;
  if (existing?.publishedAt) return existing.publishedAt;
  return new Date().toISOString();
}

export async function createProjectRecord(input: ProjectInput) {
  const supabase = requireSupabaseAdmin();
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
  const status = input.status ?? "draft";

  const { data, error } = await supabase
    .from(PAM_AFRICA_PROJECTS)
    .insert({
      slug,
      title: input.title.trim(),
      year: String(input.year ?? new Date().getFullYear()),
      blurb: input.blurb ?? "",
      cover_url: input.cover || null,
      gallery_urls: input.gallery ?? [],
      info: input.info ?? "",
      project_type: input.type || "Energy",
      featured: Boolean(input.featured),
      sort_order: input.sortOrder ?? 0,
      status,
      published_at: nextPublishedAt({ ...input, status }),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProjectRow(data as ProjectRow);
}

export async function updateProjectRecord(slug: string, input: ProjectInput) {
  const existing = await getProjectBySlugAny(slug);
  if (!existing) {
    throw new Error("Project not found");
  }

  const nextSlug = input.slug?.trim() ? slugify(input.slug) : existing.slug;
  const status = input.status ?? existing.status;

  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from(PAM_AFRICA_PROJECTS)
    .update({
      slug: nextSlug,
      title: input.title.trim(),
      year: String(input.year ?? existing.year),
      blurb: input.blurb ?? "",
      cover_url: input.cover || null,
      gallery_urls: input.gallery ?? [],
      info: input.info ?? "",
      project_type: input.type || existing.type,
      featured: input.featured ?? existing.featured,
      sort_order: input.sortOrder ?? existing.sortOrder,
      status,
      published_at: nextPublishedAt({ ...input, status }, existing),
    })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProjectRow(data as ProjectRow);
}

export async function deleteProjectRecord(slug: string) {
  const existing = await getProjectBySlugAny(slug);
  if (!existing) {
    throw new Error("Project not found");
  }

  try {
    await deleteProjectMediaForRecord(existing);
  } catch (err) {
    console.error("Project media cleanup failed:", err);
  }

  const supabase = requireSupabaseAdmin();
  const { error } = await supabase
    .from(PAM_AFRICA_PROJECTS)
    .delete()
    .eq("slug", slug);
  if (error) {
    throw new Error(error.message);
  }
}

export async function countProjects() {
  const rows = await listAllProjects();
  return {
    total: rows.length,
    published: rows.filter((row) => row.status === "published").length,
    drafts: rows.filter((row) => row.status === "draft").length,
  };
}
