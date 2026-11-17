import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getJournalById } from "@/lib/journals";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const journal = await getJournalById(id);
    if (!journal) {
      return NextResponse.json(
        { success: false, message: "Journal not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: journal });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to fetch journal",
      },
      { status: 500 }
    );
  }
}
