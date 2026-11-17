"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAction } from "@/components/admin/AdminActionProvider";
import type { ProjectRecord } from "@/lib/projectTypes";

export default function ProjectsTable({
  projects,
}: {
  projects: ProjectRecord[];
}) {
  const router = useRouter();
  const { runAction } = useAdminAction();

  const remove = async (slug: string, title: string) => {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    await runAction(`Deleting “${title}” and its media`, async () => {
      const response = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }
      router.refresh();
      return result;
    }).catch((err) => {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    });
  };

  if (projects.length === 0) {
    return (
      <p className="border border-white/10 bg-[#131313] px-4 py-10 text-center text-white/50">
        No projects yet. Create the first project.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-white/10">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-[#131313] text-white/45">
          <tr>
            <th className="px-4 py-3 font-normal">Cover</th>
            <th className="px-4 py-3 font-normal">Title</th>
            <th className="px-4 py-3 font-normal">Type</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 font-normal">Year</th>
            <th className="px-4 py-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-white/10">
              <td className="px-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.cover}
                  alt=""
                  className="h-14 w-20 object-cover"
                />
              </td>
              <td className="px-4 py-3">{project.title}</td>
              <td className="px-4 py-3 text-white/60">{project.type}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs ${
                    project.status === "published"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {project.status}
                </span>
              </td>
              <td className="px-4 py-3 text-white/60">{project.year}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/projects/${project.id}/preview`}
                    className="text-white/60 underline underline-offset-4 hover:text-white"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="underline underline-offset-4"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(project.slug, project.title)}
                    className="text-white/50 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
