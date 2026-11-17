import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/adminAuth";
import { getAdminBaseUrl } from "@/lib/adminBaseUrl";
import {
  createOrRefreshInvitedAdmin,
  listTeamMembers,
  removeTeamMember,
} from "@/lib/auth/users";
import { sendAdminInviteEmail } from "@/lib/emailService";
import {
  formatAdminActionError,
  formatSmtpErrorForAdmin,
} from "@/lib/userFacingErrors";

function inviteUrlFrom(request: Request, token: string) {
  return `${getAdminBaseUrl(request)}/admin/accept-invite?token=${token}`;
}

async function sendInvite(request: Request, email: string) {
  const { user, token } = await createOrRefreshInvitedAdmin(email);
  const inviteUrl = inviteUrlFrom(request, token);

  try {
    await sendAdminInviteEmail(user.email, inviteUrl);
    return NextResponse.json({
      success: true,
      message: `Invite sent to ${user.email}`,
    });
  } catch (err) {
    console.error("Admin invite email failed:", err);
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
}

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const data = await listTeamMembers();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: formatAdminActionError(err, "Could not load team. Please try again."),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { admin, error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "User id is required" },
        { status: 400 }
      );
    }

    await removeTeamMember(id, admin!);
    return NextResponse.json({
      success: true,
      message: "Team member removed",
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: formatAdminActionError(err, "Could not remove this user. Please try again."),
      },
      { status: 400 }
    );
  }
}

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

    return sendInvite(request, email);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: formatAdminActionError(err, "Could not send invite. Please try again."),
      },
      { status: 500 }
    );
  }
}
