import { NextResponse } from "next/server";
import { authenticateUser, canUseCustomAuth } from "@/lib/auth/users";
import { ADMIN_COOKIE, adminCookieOptions, signAdminToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  if (!canUseCustomAuth()) {
    return NextResponse.json(
      { success: false, message: "Sign-in is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signAdminToken({ sub: user.id, email: user.email });
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to sign in" },
      { status: 500 }
    );
  }
}
