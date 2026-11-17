import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  const { admin, error } = await requireAdmin();
  if (error) return error;

  return NextResponse.json({
    success: true,
    data: admin,
  });
}
