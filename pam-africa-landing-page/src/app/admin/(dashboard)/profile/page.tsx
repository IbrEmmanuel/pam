import ProfilePanel from "@/components/admin/ProfilePanel";
import { getAdminUser } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  return (
    <div>
      <p className="text-sm text-white/40">Account</p>
      <h1 className="mt-2 text-4xl">Profile</h1>
      <div className="mt-10">
        <ProfilePanel email={admin.email} />
      </div>
    </div>
  );
}
