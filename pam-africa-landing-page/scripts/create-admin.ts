/**
 * Create the first admin user locally.
 *
 * PowerShell (password with ! @ etc.): use single quotes or env var:
 *   npm run create:admin -- support@pamafrica.com 'YourPass@word!'
 *   $env:CREATE_ADMIN_PASSWORD='YourPass@word!'; npm run create:admin -- support@pamafrica.com
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { createUser, countUsers } from "../src/lib/auth/users";

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

function exit(code: number) {
  setTimeout(() => process.exit(code), 50);
}

async function main() {
  loadEnv();
  const email = process.argv[2]?.trim();
  const password =
    process.env.CREATE_ADMIN_PASSWORD?.trim() ||
    process.argv.slice(3).join(" ").trim();

  if (!email || !password) {
    console.error("Usage:");
    console.error("  npm run create:admin -- email@example.com 'YourPassword'");
    console.error("  $env:CREATE_ADMIN_PASSWORD='YourPassword'; npm run create:admin -- email@example.com");
    exit(1);
    return;
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    exit(1);
    return;
  }

  const total = await countUsers();
  if (total > 0) {
    console.error("An admin user already exists. Use /admin/forgot-password.");
    exit(1);
    return;
  }

  const bootstrap = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (bootstrap && email.toLowerCase() !== bootstrap) {
    console.error(`First admin must use ADMIN_EMAIL (${bootstrap}).`);
    exit(1);
    return;
  }

  const user = await createUser(email, password, "super_admin");
  console.log(`Created admin: ${user.email}`);
  console.log("Sign in at /admin/login");
  exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  if (error instanceof Error && /pam_africa_users|relation|does not exist/i.test(error.message)) {
    console.error("\nRun supabase/migrations/001_journals.sql in the Supabase SQL editor first.");
  }
  exit(1);
});
