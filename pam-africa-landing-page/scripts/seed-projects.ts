/**
 * Upsert local constants/projects.ts into pam_africa_projects as published.
 * Usage: npx tsx scripts/seed-projects.ts
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import { projects } from "../src/constants/projects";
import { projectsData } from "../src/constants/featuredProjects";

const ROOT = process.cwd();

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

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const supabase = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const featuredBySlug = new Map(
    projectsData.map((item) => [item.slug, item])
  );

  for (const [index, project] of projects.entries()) {
    const featured = featuredBySlug.get(project.slug);
    const row = {
      slug: project.slug,
      title: project.title,
      year: String(project.year),
      blurb: project.blurb ?? "",
      cover_url: project.cover,
      gallery_urls: project.gallery,
      info: project.info ?? "",
      project_type: featured?.type || "Energy",
      featured: Boolean(featured),
      sort_order: index,
      status: "published",
      published_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("pam_africa_projects")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      throw new Error(`${project.slug}: ${error.message}`);
    }
    console.log(`Upserted ${project.slug}`);
  }

  console.log(`Done. Seeded ${projects.length} projects.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
