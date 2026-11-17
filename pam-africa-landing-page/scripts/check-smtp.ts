import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getSmtpConfig, verifySmtpConnection } from "../src/lib/smtp";
import { formatSmtpErrorForDev } from "../src/lib/userFacingErrors";

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
  const cfg = getSmtpConfig();
  console.log("SMTP check");
  console.log("----------");
  console.log(`Host: ${cfg.host}:${cfg.port} (secure=${cfg.secure})`);
  console.log(`User: ${cfg.user || "(missing EMAIL_USER)"}`);

  try {
    await verifySmtpConnection();
    console.log("OK — SMTP login succeeded.");
    process.exit(0);
  } catch (error) {
    console.error(formatSmtpErrorForDev(error));
    process.exit(1);
  }
}

main();
