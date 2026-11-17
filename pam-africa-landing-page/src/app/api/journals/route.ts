import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  createJournalRecord,
  listPublishedJournals,
} from "@/lib/journals";
import { revalidatePublicJournals } from "@/lib/revalidateJournals";

export const revalidate = 60;

export async function GET() {
  try {
    const journals = await listPublishedJournals();
    return NextResponse.json(
      {
        success: true,
        data: journals,
        total: journals.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching journals:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch journals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
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

    const journal = await createJournalRecord({
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

    return NextResponse.json(
      {
        success: true,
        data: journal,
        message: "Journal created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating journal:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to create journal",
      },
      { status: 500 }
    );
  }
}
