import Link from "next/link";
import { listAllProjects } from "@/lib/projects";
import ProjectsTable from "@/components/admin/ProjectsTable";
import type { ProjectRecord } from "@/lib/projectTypes";

export default async function AdminProjectsPage() {
  let projects: ProjectRecord[] = [];
  let error = "";

  try {
    projects = await listAllProjects();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load projects";
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-white/40">Content</p>
          <h1 className="mt-2 text-4xl">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="bg-white px-5 py-3 text-sm text-black">
          New project
        </Link>
      </div>

      {error ? (
        <p className="mt-8 border border-white/10 bg-white/5 px-4 py-3 text-sm">
          {error}
        </p>
      ) : (
        <div className="mt-8">
          <ProjectsTable projects={projects} />
        </div>
      )}
    </div>
  );
}
