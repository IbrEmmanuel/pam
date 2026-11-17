import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  deleteJournalRecord,
  getPublishedJournalBySlug,
  updateJournalRecord,
} from "@/lib/journals";
import { revalidatePublicJournals } from "@/lib/revalidateJournals";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const journal = await getPublishedJournalBySlug(slug);

    if (!journal) {
      return NextResponse.json(
        { success: false, message: "Journal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: journal,
    });
  } catch (error) {
    console.error("Error fetching journal:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch journal" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { slug } = await params;
    const body = await request.json();

    if (!body.title || !body.excerpt || !body.body) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: title, excerpt, body",
        },
        { status: 400 }
      );
    }

    const journal = await updateJournalRecord(slug, {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      body: body.body,
      category: body.category,
      cover: body.cover,
      subtext: body.subtext,
      gallery: body.gallery || [],
      status: body.status === "published" ? "published" : "draft",
      publishedAt: body.publishedAt ?? null,
    });

    revalidatePublicJournals();

    return NextResponse.json({
      success: true,
      data: journal,
      message: "Journal updated successfully",
    });
  } catch (err) {
    console.error("Error updating journal:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to update journal",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { slug } = await params;
    await deleteJournalRecord(slug);
    revalidatePublicJournals();
    return NextResponse.json({
      success: true,
      message: "Journal deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting journal:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to delete journal",
      },
      { status: 500 }
    );
  }
}
