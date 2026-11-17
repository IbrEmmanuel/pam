import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  deleteProjectRecord,
  getPublishedProjectBySlug,
  projectToPublic,
  updateProjectRecord,
} from "@/lib/projects";
import { revalidatePublicProjects } from "@/lib/revalidateProjects";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await getPublishedProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: projectToPublic(project),
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project" },
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

    if (!body.title) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: title",
        },
        { status: 400 }
      );
    }

    const project = await updateProjectRecord(slug, {
      title: body.title,
      slug: body.slug,
      year: body.year,
      blurb: body.blurb,
      cover: body.cover,
      gallery: body.gallery || [],
      info: body.info,
      type: body.type,
      featured: Boolean(body.featured),
      sortOrder:
        typeof body.sortOrder === "number"
          ? body.sortOrder
          : Number(body.sortOrder) || 0,
      status: body.status === "published" ? "published" : "draft",
      publishedAt: body.publishedAt ?? null,
    });

    revalidatePublicProjects();

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project updated successfully",
    });
  } catch (err) {
    console.error("Error updating project:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to update project",
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
    await deleteProjectRecord(slug);
    revalidatePublicProjects();
    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting project:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
