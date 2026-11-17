import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listAllProjects } from "@/lib/projects";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const projects = await listAllProjects();
    return NextResponse.json({
      success: true,
      data: projects,
      total: projects.length,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to list projects",
      },
      { status: 500 }
    );
  }
}
