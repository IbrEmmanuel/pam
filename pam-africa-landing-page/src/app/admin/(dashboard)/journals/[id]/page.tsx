import Link from "next/link";
import { notFound } from "next/navigation";
import JournalForm from "@/components/admin/JournalForm";
import { getJournalById } from "@/lib/journals";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const journal = await getJournalById(id);
  if (!journal) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-white/40">Journals</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl">Edit journal</h1>
        <Link
          href={`/admin/journals/${id}/preview`}
          className="border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
        >
          Preview
        </Link>
      </div>
      <div className="mt-8">
        <JournalForm journal={journal} />
      </div>
    </div>
  );
}
