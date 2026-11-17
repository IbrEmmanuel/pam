import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournalById } from "@/lib/journals";

export default async function JournalPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getJournalById(id);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-4xl bg-white text-black">
      <div className="sticky top-0 z-10 border-b border-black/10 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <strong>Preview</strong> — {article.status === "draft" ? "Draft" : "Published"} (not
        visible on the public site until published).{" "}
        <Link href={`/admin/journals/${id}`} className="underline underline-offset-2">
          Back to edit
        </Link>
      </div>

      {article.cover && (
        <div className="relative h-[320px] w-full md:h-[433px]">
          <Image src={article.cover} alt="" fill className="object-cover" priority />
        </div>
      )}

      <article className="px-4 py-10 prose prose-gray max-w-none">
        <p className="not-prose text-sm">
          <span className="bg-black px-3 py-1 text-white">{article.category}</span>
        </p>
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="lead">{article.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
        {article.subtext && (
          <p>
            <em>{article.subtext}</em>
          </p>
        )}
      </article>

      {article.gallery && article.gallery.length > 0 && (
        <section className="grid gap-4 px-4 pb-12 sm:grid-cols-2">
          {article.gallery.map((src) => (
            <div key={src} className="relative aspect-[16/10]">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
