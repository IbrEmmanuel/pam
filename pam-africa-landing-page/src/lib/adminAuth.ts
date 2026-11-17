import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AdminRole } from "@/lib/auth/users";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth/jwt";
import { findUserById } from "@/lib/auth/users";

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
};

export async function getAdminUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyAdminToken(token);
  if (!payload) return null;

  try {
    const user = await findUserById(payload.sub);
    if (!user || user.invite_token_hash) return null;
    return {
      id: user.id,
      email: user.email,
      role: user.role ?? "admin",
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    return {
      admin: null,
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }
  return { admin, error: null };
}

export async function requireSuperAdmin() {
  const result = await requireAdmin();
  if (result.error) return result;
  if (result.admin!.role !== "super_admin") {
    return {
      admin: null,
      error: NextResponse.json(
        { success: false, message: "Super admin access required" },
        { status: 403 }
      ),
    };
  }
  return result;
}
