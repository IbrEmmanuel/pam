import { NextResponse } from "next/server";
import { canUseCustomAuth, startPasswordReset } from "@/lib/auth/users";
import { getAdminBaseUrl } from "@/lib/adminBaseUrl";
import { sendPasswordResetEmail } from "@/lib/emailService";
import { formatSmtpErrorForAdmin } from "@/lib/userFacingErrors";

export async function POST(request: Request) {
  if (!canUseCustomAuth()) {
    return NextResponse.json(
      { success: false, message: "Password reset is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const reset = await startPasswordReset(email);
    if (reset) {
      const url = `${getAdminBaseUrl(request)}/admin/reset-password?token=${reset.token}`;
      await sendPasswordResetEmail(reset.email, url);
    }

    return NextResponse.json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password failed:", error);
    return NextResponse.json(
      { success: false, message: formatSmtpErrorForAdmin(error) },
      { status: 502 }
    );
  }
}
