import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-white/40">Projects</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Edit project</h1>
        <Link
          href={`/admin/projects/${id}/preview`}
          className="border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
        >
          Preview
        </Link>
      </div>
      <div className="mt-8">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
