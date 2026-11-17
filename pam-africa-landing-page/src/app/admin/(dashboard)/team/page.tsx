import TeamPanel from "@/components/admin/TeamPanel";
import { getAdminUser } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  if (admin.role !== "super_admin") {
    return (
      <div>
        <h1 className="text-4xl">Team</h1>
        <p className="mt-6 text-white/50">
          Only the super admin can invite new admins. Contact support@pamafrica.com.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-white/40">Settings</p>
      <h1 className="mt-2 text-4xl">Team</h1>
      <p className="mt-3 max-w-xl text-white/50">
        Invite colleagues by email. They receive a link to set a password and sign in.
      </p>
      <div className="mt-10">
        <TeamPanel />
      </div>
    </div>
  );
}
