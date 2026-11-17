import AdminShell from "@/components/admin/AdminShell";
import { AdminActionProvider } from "@/components/admin/AdminActionProvider";
import { getAdminUser } from "@/lib/adminAuth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const admin = await getAdminUser();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminActionProvider>
      <AdminShell email={admin.email} role={admin.role}>
        {children}
      </AdminShell>
    </AdminActionProvider>
  );
}
