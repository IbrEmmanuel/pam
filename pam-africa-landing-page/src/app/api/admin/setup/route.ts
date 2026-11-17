import { NextResponse } from "next/server";
import { canUseCustomAuth, countUsers } from "@/lib/auth/users";
import { getAdminEnvStatus } from "@/lib/supabase/env";

/** GET: used by login page to show env / “no admin yet” hints. */
export async function GET() {
  const env = getAdminEnvStatus();
  if (!env.ready) {
    return NextResponse.json({
      success: true,
      configured: false,
      needsSetup: false,
      missing: env.missing,
      message:
        "Admin is not fully configured yet. Please contact support@pamafrica.com for assistance.",
    });
  }

  if (!canUseCustomAuth()) {
    return NextResponse.json({
      success: true,
      configured: false,
      needsSetup: false,
      missing: env.missing,
    });
  }

  try {
    const total = await countUsers();
    return NextResponse.json({
      success: true,
      configured: true,
      needsSetup: total === 0,
    });
  } catch {
    return NextResponse.json({
      success: true,
      configured: true,
      needsSetup: false,
      message:
        "Admin is not fully configured yet. Please contact support@pamafrica.com for assistance.",
    });
  }
}

/** Web setup disabled — use npm run create:admin */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: "Setup through this page is not available. Please contact support@pamafrica.com.",
    },
    { status: 403 }
  );
}
