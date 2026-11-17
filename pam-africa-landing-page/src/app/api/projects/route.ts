import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  createProjectRecord,
  listPublishedProjects,
  projectToPublic,
} from "@/lib/projects";
import { revalidatePublicProjects } from "@/lib/revalidateProjects";

export const revalidate = 60;

export async function GET() {
  try {
    const projects = await listPublishedProjects();
    return NextResponse.json(
      {
        success: true,
        data: projects.map(projectToPublic),
        total: projects.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
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

    const project = await createProjectRecord({
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

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating project:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}
