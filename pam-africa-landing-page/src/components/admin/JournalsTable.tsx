"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAction } from "@/components/admin/AdminActionProvider";
import type { JournalRecord } from "@/lib/journalTypes";

export default function JournalsTable({
  journals,
}: {
  journals: JournalRecord[];
}) {
  const router = useRouter();
  const { runAction } = useAdminAction();

  const remove = async (slug: string, title: string) => {
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    await runAction(`Deleting “${title}” and its media`, async () => {
      const response = await fetch(`/api/journals/${slug}`, { method: "DELETE" });
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

  if (journals.length === 0) {
    return (
      <p className="border border-white/10 bg-[#131313] px-4 py-10 text-center text-white/50">
        No journals yet. Create the first post.
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
            <th className="px-4 py-3 font-normal">Category</th>
            <th className="px-4 py-3 font-normal">Status</th>
            <th className="px-4 py-3 font-normal">Date</th>
            <th className="px-4 py-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {journals.map((journal) => (
            <tr key={journal.id} className="border-t border-white/10">
              <td className="px-4 py-3">
                <img
                  src={journal.cover}
                  alt=""
                  className="h-14 w-20 object-cover"
                />
              </td>
              <td className="px-4 py-3">{journal.title}</td>
              <td className="px-4 py-3 text-white/60">{journal.category}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs ${
                    journal.status === "published"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {journal.status}
                </span>
              </td>
              <td className="px-4 py-3 text-white/60">{journal.date}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/journals/${journal.id}/preview`}
                    className="text-white/60 underline underline-offset-4 hover:text-white"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/admin/journals/${journal.id}`}
                    className="underline underline-offset-4"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(journal.slug, journal.title)}
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
