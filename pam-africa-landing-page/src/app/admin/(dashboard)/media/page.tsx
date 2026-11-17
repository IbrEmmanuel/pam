import MediaLibrary from "@/components/admin/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div>
      <p className="text-sm text-white/40">Library</p>
      <h1 className="mt-2 text-4xl">Media</h1>
      <p className="mt-3 max-w-2xl text-white/55">
        Files uploaded here are stored in the Supabase{" "}
        <code>pam-africa-journal-media</code>{" "}
        bucket (including migrated <code>sanity/</code> files). Files marked “Used in a journal”
        need to be removed from the post first, or you can force-delete from here.
      </p>
      <div className="mt-8">
        <MediaLibrary />
      </div>
    </div>
  );
}
