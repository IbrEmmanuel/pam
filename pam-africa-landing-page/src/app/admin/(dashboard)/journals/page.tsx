import Link from "next/link";
import { listAllJournals } from "@/lib/journals";
import JournalsTable from "@/components/admin/JournalsTable";
import type { JournalRecord } from "@/lib/journalTypes";

export default async function AdminJournalsPage() {
  let journals: JournalRecord[] = [];
  let error = "";

  try {
    journals = await listAllJournals();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load journals";
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-white/40">Content</p>
          <h1 className="mt-2 text-4xl">Journals</h1>
        </div>
        <Link href="/admin/journals/new" className="bg-white px-5 py-3 text-sm text-black">
          New journal
        </Link>
      </div>

      {error ? (
        <p className="mt-8 border border-white/10 bg-white/5 px-4 py-3 text-sm">
          {error}
        </p>
      ) : (
        <div className="mt-8">
          <JournalsTable journals={journals} />
        </div>
      )}
    </div>
  );
}
