import Link from "next/link";

import ProjectInfoDrawer from "@/components/projects/ProjectInfoDrawer";
import HorizontalScrollOnVertical from "@/components/HoriScrolling";
import {
  getPublishedProjectBySlug,
  listPublishedProjects,
  projectToPublic,
} from "@/lib/projects";
import NavBar from "@/components/NavBar";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const projects = await listPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const record = await getPublishedProjectBySlug(slug);
  if (!record) return <div className="p-6">Not found</div>;
  const project = projectToPublic(record);

  return (
    <main>
      <NavBar />
      <div className="mx-auto overflow-clip max-w-[1200px] px-3 md:px-6">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <HorizontalScrollOnVertical
            images={project.gallery}
            alt={project.title}
            className="mt-2"
          />
        </div>
        <div className="flex items-center justify-between py-3 md:py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border px-3 py-1.5  text-sm hover:bg-[#000000] hover:text-white transition"
          >
            <span>←</span> Go Back
          </Link>

          <ProjectInfoDrawer title={project.title} info={project.info} />
        </div>
      </div>
    </main>
  );
}
