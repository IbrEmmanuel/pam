import { redirect } from "next/navigation";

/**
 * Web admin setup is disabled for now.
 * Create the first admin locally: npm run create:admin -- email@example.com YourPassword
 *
 * Previous UI lived here; re-enable by restoring from git history when needed.
 */
export default function AdminSetupPage() {
  redirect("/admin/login");
}
