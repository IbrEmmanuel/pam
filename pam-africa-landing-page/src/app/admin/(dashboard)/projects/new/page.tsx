import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-white/40">Projects</p>
      <h1 className="mt-2 text-4xl">New project</h1>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
