import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FormattedText from "@/lib/textFormat";
import { getProjectById } from "@/lib/projects";

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-4xl bg-white text-black">
      <div className="sticky top-0 z-10 border-b border-black/10 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <strong>Preview</strong> — {project.status === "draft" ? "Draft" : "Published"}{" "}
        (not visible on the public site until published).{" "}
        <Link href={`/admin/projects/${id}`} className="underline underline-offset-2">
          Back to edit
        </Link>
      </div>

      {project.cover && (
        <div className="relative h-[320px] w-full md:h-[433px]">
          <Image src={project.cover} alt="" fill className="object-cover" priority />
        </div>
      )}

      <article className="px-4 py-10">
        <p className="text-sm">
          <span className="bg-black px-3 py-1 text-white">{project.type}</span>
          <span className="ml-3 text-black/50">{project.year}</span>
        </p>
        <h1 className="mt-4 text-3xl font-bold">{project.title}</h1>
        {project.blurb && <p className="mt-4 text-lg text-black/70">{project.blurb}</p>}
        {project.info && (
          <p className="mt-8 whitespace-pre-line text-neutral-700">
            <FormattedText>{project.info}</FormattedText>
          </p>
        )}
      </article>

      {project.gallery && project.gallery.length > 0 && (
        <section className="space-y-6 px-4 pb-12">
          {project.gallery.map((src, index) => (
            <div key={`${src}-${index}`}>
              <div className="relative aspect-[16/10]">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
              <p className="mt-2 text-sm font-semibold">
                {(index + 1).toString().padStart(2, "0")}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
