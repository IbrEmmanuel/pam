"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAction } from "@/components/admin/AdminActionProvider";
import TiptapEditor from "@/components/admin/TiptapEditor";
import ImageField from "@/components/admin/ImageField";
import {
  JOURNAL_CATEGORIES,
  slugify,
  type JournalRecord,
  type JournalStatus,
} from "@/lib/journalTypes";

type Props = {
  journal?: JournalRecord | null;
};

export default function JournalForm({ journal }: Props) {
  const router = useRouter();
  const { runAction } = useAdminAction();
  const [title, setTitle] = useState(journal?.title ?? "");
  const [slug, setSlug] = useState(journal?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(journal?.slug));
  const [category, setCategory] = useState(journal?.category ?? "General");
  const [excerpt, setExcerpt] = useState(journal?.excerpt ?? "");
  const [body, setBody] = useState(journal?.body ?? "");
  const [subtext, setSubtext] = useState(journal?.subtext ?? "");
  const [cover, setCover] = useState(journal?.cover ?? "");
  const [gallery, setGallery] = useState<string[]>(journal?.gallery ?? []);
  const [status, setStatus] = useState<JournalStatus>(journal?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const resolvedSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title]
  );

  const submit = async (nextStatus: JournalStatus) => {
    setSaving(true);
    setMessage("");
    const label = nextStatus === "published" ? "Publishing journal" : "Saving draft";
    try {
      await runAction(label, async () => {
        const payload = {
          title,
          slug: resolvedSlug,
          category,
          excerpt,
          body,
          subtext,
          cover,
          gallery,
          status: nextStatus,
        };

        const response = journal
          ? await fetch(`/api/journals/${journal.slug}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch("/api/journals", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Save failed");
        }

        setStatus(nextStatus);
        router.push("/admin/journals");
        router.refresh();
        return result;
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        submit(status);
      }}
    >
      {message && (
        <p className="border border-white/10 bg-white/5 px-4 py-3 text-sm">{message}</p>
      )}

      <label className="grid gap-2">
        <span className="text-sm text-white/60">Title</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-white/60">Slug</span>
        <input
          value={resolvedSlug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
        />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-white/60">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="border border-white/10 bg-[#000000] px-3 py-3 outline-none focus:border-white"
          >
            {JOURNAL_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/60">Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as JournalStatus)}
            className="border border-white/10 bg-[#000000] px-3 py-3 outline-none focus:border-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm text-white/60">Excerpt</span>
        <textarea
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          required
          rows={3}
          className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
        />
      </label>

      <ImageField
        label="Cover image"
        value={cover}
        folder="covers"
        onChange={setCover}
        onClear={() => setCover("")}
      />

      <div>
        <p className="mb-2 text-sm text-white/60">Body</p>
        <TiptapEditor value={body} onChange={setBody} />
      </div>

      <label className="grid gap-2">
        <span className="text-sm text-white/60">Subtext</span>
        <textarea
          value={subtext}
          onChange={(event) => setSubtext(event.target.value)}
          rows={3}
          className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
        />
      </label>

      <div>
        <p className="mb-2 text-sm text-white/60">Gallery</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {gallery.map((url, index) => (
            <ImageField
              key={`${url}-${index}`}
              label={`Image ${index + 1}`}
              value={url}
              folder="gallery"
              onChange={(next) => {
                const copy = [...gallery];
                copy[index] = next;
                setGallery(copy);
              }}
              onClear={() => setGallery(gallery.filter((_, i) => i !== index))}
            />
          ))}
          <ImageField
            label="Add gallery image"
            folder="gallery"
            onChange={(url) => setGallery([...gallery, url])}
          />
        </div>
      </div>

      {journal && (
        <p className="text-sm text-white/50">
          Drafts are not on the public site.{" "}
          <Link
            href={`/admin/journals/${journal.id}/preview`}
            className="text-white underline underline-offset-4"
          >
            Preview this entry
          </Link>
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => submit("draft")}
          className="border border-white/20 px-5 py-3 text-sm disabled:opacity-50"
        >
          Save draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => submit("published")}
          className="bg-white px-5 py-3 text-sm text-black disabled:opacity-50"
        >
          {saving ? "Saving…" : "Publish"}
        </button>
      </div>
    </form>
  );
}
