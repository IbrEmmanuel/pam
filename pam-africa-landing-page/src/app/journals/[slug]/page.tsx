import { notFound } from "next/navigation";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { ArrowDownRight, ChevronUp } from "lucide-react";
import Link from "next/link";
import JournalsSlide from "@/components/journals/JournalSlides";
import ShareButton from "@/components/journals/ShareButton";
import { fetchJournalBySlug, fetchJournals } from "@/lib/journalService";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const journals = await fetchJournals();
  return journals.map((journal) => ({ slug: journal.slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchJournalBySlug(slug);

  if (!article) return notFound();

  return (
    <main className="mx-auto">
      <NavBar />

      {/* Back button */}
      <Link
        href="/journals"
        className="flex w-[104px] items-center gap-1 border border-gray-500 ml-4 px-2.5 py-2"
      >
        <ChevronUp className="transform -rotate-90" />
        Back
      </Link>

      {/* Cover */}
      <div className="w-full h-[433px] mt-6">
        <Image
          src={article.cover}
          alt={article.title}
          width={1500}
          height={1500}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-8 my-[54px] px-4">
        {/* Category */}
        <p className="col-span-4 md:col-span-1">
          <span className="text-sm bg-black text-white px-4 py-2">
            {article.category}
          </span>
        </p>

        {/* Share (mobile) */}
        <ShareButton
          title={article.title}
          excerpt={article.excerpt}
          className="flex col-span-8 order-2 md:hidden w-[130px] items-center gap-1 border border-gray-500 ml-4 px-2.5 py-2 mt-10 text-sm hover:bg-gray-100 transition-colors"
        >
          Share Article
          <ArrowDownRight strokeWidth={0.75} className="-rotate-90" />
        </ShareButton>

        {/* Article */}
        <article className="col-span-8 mt-8 md:col-span-5 order-2 md:order-none prose prose-gray max-w-none">
          <h1 className="text-3xl font-bold mb-6">{article.title}</h1>

          <p className="lead">{article.excerpt}</p>

          {/* 🔥 FIXED BODY RENDERING */}
          <div
            className="
              prose 
              prose-gray 
              max-w-none
              prose-p:my-6
              prose-blockquote:my-6
              prose-blockquote:border-l-4
              prose-blockquote:border-gray-300
              prose-blockquote:pl-4
              prose-blockquote:italic
              prose-blockquote:text-gray-700
              prose-a:text-blue-600
              prose-a:no-underline
              prose-a:hover:underline
              prose-a:font-medium
              prose-ul:my-6
              prose-ol:my-6
              prose-li:my-2
            "
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {article.subtext && (
            <p className="mt-6">
              <em>{article.subtext}</em>
            </p>
          )}
        </article>

        {/* Date */}
        <p className="col-span-4 md:col-span-2 text-right font-semibold">
          {article.date}
        </p>
      </div>

      {/* Gallery */}
      {article.gallery && article.gallery.length > 1 && (
        <section className="mt-8 grid sm:grid-cols-2 gap-4">
          {article.gallery.map((src) => (
            <div key={src} className="relative aspect-[16/10]">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </section>
      )}

      {article.gallery && article.gallery.length === 1 && (
        <section className="mt-8 max-w-[925px] mx-auto">
          <div className="relative aspect-[16/10]">
            <Image
              src={article.gallery[0]}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </section>
      )}

      <JournalsSlide currentSlug={slug} />
    </main>
  );
}
