import { NextResponse } from "next/server";
import { acceptInviteWithPassword, canUseCustomAuth } from "@/lib/auth/users";

export async function POST(request: Request) {
  if (!canUseCustomAuth()) {
    return NextResponse.json(
      { success: false, message: "This page is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token and password are required" },
        { status: 400 }
      );
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const ok = await acceptInviteWithPassword(token, password);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired invite link" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account ready. You can sign in now.",
    });
  } catch (error) {
    console.error("Accept invite failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to activate account" },
      { status: 500 }
    );
  }
}
