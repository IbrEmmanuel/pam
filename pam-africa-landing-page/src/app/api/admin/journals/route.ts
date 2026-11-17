import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listAllJournals } from "@/lib/journals";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const journals = await listAllJournals();
    return NextResponse.json({
      success: true,
      data: journals,
      total: journals.length,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to list journals",
      },
      { status: 500 }
    );
  }
}
