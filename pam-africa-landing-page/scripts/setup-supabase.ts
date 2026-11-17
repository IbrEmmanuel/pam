import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const BUCKET = "pam-africa-journal-media";

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

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw new Error(listError.message);

  if (!buckets?.some((bucket) => bucket.id === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(error.message);
    console.log(`Created public bucket ${BUCKET}`);
  } else {
    console.log(`Bucket ${BUCKET} already exists`);
  }

  const { error: tableError } = await supabase
    .from("pam_africa_journals")
    .select("id")
    .limit(1);
  if (tableError) {
    const msg = tableError.message || "";
    if (/permission denied/i.test(msg)) {
      console.log("\nTables exist but API access is denied.");
      console.log("Run supabase/migrations/002_grants.sql in the Supabase SQL editor.");
    } else {
      console.log("\nJournals table is missing or not visible to the API.");
      console.log("Run supabase/migrations/001_journals.sql then 002_grants.sql");
    }
    process.exit(1);
  }

  const { error: usersError } = await supabase
    .from("pam_africa_users")
    .select("id")
    .limit(1);
  if (usersError) {
    console.log("\nUsers table is missing.");
    console.log("Open the Supabase SQL editor and run supabase/migrations/001_journals.sql");
    process.exit(1);
  }

  const { error: projectsError } = await supabase
    .from("pam_africa_projects")
    .select("id")
    .limit(1);
  if (projectsError) {
    console.log("\nProjects table is missing or not visible to the API.");
    console.log("Run supabase/migrations/005_projects.sql in the Supabase SQL editor.");
    process.exit(1);
  }

  console.log("Journals, projects, and users tables are available.");
  console.log("Create the first admin: npm run create:admin -- you@email.com YourPassword");
  console.log("Then sign in at /admin/login");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
