import { NextResponse } from "next/server";
import { canUseCustomAuth, resetPasswordWithToken } from "@/lib/auth/users";

export async function POST(request: Request) {
  if (!canUseCustomAuth()) {
    return NextResponse.json(
      { success: false, message: "Password reset is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const { token, password } = await request.json();
    if (!token || !password || String(password).length < 8) {
      return NextResponse.json(
        { success: false, message: "A valid token and a password of at least 8 characters are required" },
        { status: 400 }
      );
    }

    const ok = await resetPasswordWithToken(token, password);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "This reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (error) {
    console.error("Reset password failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
