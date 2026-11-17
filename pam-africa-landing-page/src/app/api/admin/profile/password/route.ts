import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { changePassword } from "@/lib/auth/users";

export async function POST(request: Request) {
  const { admin, error } = await requireAdmin();
  if (error) return error;

  try {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current and new password are required" },
        { status: 400 }
      );
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const result = await changePassword(admin!.id, currentPassword, newPassword);
    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to update password",
      },
      { status: 500 }
    );
  }
}
