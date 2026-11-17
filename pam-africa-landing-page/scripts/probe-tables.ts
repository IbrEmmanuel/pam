import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = join(ROOT, file);
    if (!existsSync(path)) continue;
    for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const i = line.indexOf("=");
      if (i === -1) continue;
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function probe(name: string) {
  const { data, error, count } = await supabase.from(name).select("*", { count: "exact" }).limit(1);
  if (error) {
    console.log(name, "ERROR:", JSON.stringify(error));
    return;
  }
  console.log(name, `OK rows≈${count ?? data?.length ?? 0}`);
}

async function main() {
  console.log("Project:", url);
  for (const name of [
    "pam_africa_journals",
    "pam_africa_users",
    "pam_admins",
    "users",
    "journals",
  ]) {
    await probe(name);
  }
  setTimeout(() => process.exit(0), 50);
}

main();
