import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/adminAuth";
import { getAdminBaseUrl } from "@/lib/adminBaseUrl";
import { refreshInvitedAdmin } from "@/lib/auth/users";
import { sendAdminInviteEmail } from "@/lib/emailService";
import {
  formatAdminActionError,
  formatSmtpErrorForAdmin,
} from "@/lib/userFacingErrors";

export async function POST(request: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const { user, token } = await refreshInvitedAdmin(email);
    const inviteUrl = `${getAdminBaseUrl(request)}/admin/accept-invite?token=${token}`;

    try {
      await sendAdminInviteEmail(user.email, inviteUrl);
      return NextResponse.json({
        success: true,
        message: `Invite resent to ${user.email}`,
      });
    } catch (err) {
      console.error("Resend invite email failed:", err);
      return NextResponse.json(
        {
          success: false,
          message: formatSmtpErrorForAdmin(err),
          inviteUrl,
          email: user.email,
        },
        { status: 502 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: formatAdminActionError(err, "Could not resend invite. Please try again."),
      },
      { status: 500 }
    );
  }
}
