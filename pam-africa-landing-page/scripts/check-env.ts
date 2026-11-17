import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getAdminEnvStatus } from "../src/lib/supabase/env";

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

loadEnv();
const status = getAdminEnvStatus();

console.log("Admin environment check");
console.log("---------------------");
if (status.ready) {
  console.log("OK — admin CMS env is complete.");
  process.exit(0);
}

console.log("Missing:");
for (const key of status.missing) {
  console.log(`  - ${key}`);
}
if (status.missing.includes("SUPABASE_SERVICE_ROLE_KEY")) {
  console.log(
    "\nGet service_role from Supabase → Project Settings → API → service_role (secret)."
  );
}
process.exit(1);
