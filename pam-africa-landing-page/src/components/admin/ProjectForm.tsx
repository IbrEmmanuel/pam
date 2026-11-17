"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAction } from "@/components/admin/AdminActionProvider";
import ImageField from "@/components/admin/ImageField";
import {
  PROJECT_TYPES,
  slugify,
  type ProjectRecord,
  type ProjectStatus,
} from "@/lib/projectTypes";

type Props = {
  project?: ProjectRecord | null;
};

export default function ProjectForm({ project }: Props) {
  const router = useRouter();
  const { runAction } = useAdminAction();
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project?.slug));
  const [year, setYear] = useState(String(project?.year ?? new Date().getFullYear()));
  const [type, setType] = useState(project?.type ?? "Energy");
  const [blurb, setBlurb] = useState(project?.blurb ?? "");
  const [info, setInfo] = useState(project?.info ?? "");
  const [cover, setCover] = useState(project?.cover ?? "");
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);
  const [featured, setFeatured] = useState(Boolean(project?.featured));
  const [sortOrder, setSortOrder] = useState(String(project?.sortOrder ?? 0));
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const resolvedSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title]
  );

  const submit = async (nextStatus: ProjectStatus) => {
    setSaving(true);
    setMessage("");
    const label = nextStatus === "published" ? "Publishing project" : "Saving draft";
    try {
      await runAction(label, async () => {
        const payload = {
          title,
          slug: resolvedSlug,
          year,
          type,
          blurb,
          info,
          cover,
          gallery,
          featured,
          sortOrder: Number(sortOrder) || 0,
          status: nextStatus,
        };

        const response = project
          ? await fetch(`/api/projects/${project.slug}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Save failed");
        }

        setStatus(nextStatus);
        router.push("/admin/projects");
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
          <span className="text-sm text-white/60">Type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="border border-white/10 bg-[#000000] px-3 py-3 outline-none focus:border-white"
          >
            {PROJECT_TYPES.map((item) => (
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
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            className="border border-white/10 bg-[#000000] px-3 py-3 outline-none focus:border-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-white/60">Year</span>
          <input
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
            className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/60">Sort order</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm text-white/60">Blurb</span>
        <textarea
          value={blurb}
          onChange={(event) => setBlurb(event.target.value)}
          rows={3}
          className="border border-white/10 bg-transparent px-3 py-3 outline-none focus:border-white"
          placeholder="Short hover text on the projects list"
        />
      </label>

      <ImageField
        label="Cover image"
        value={cover}
        folder="covers"
        onChange={setCover}
        onClear={() => setCover("")}
      />

      <label className="grid gap-2">
        <span className="text-sm text-white/60">Project info</span>
        <textarea
          value={info}
          onChange={(event) => setInfo(event.target.value)}
          rows={12}
          className="border border-white/10 bg-transparent px-3 py-3 font-mono text-sm outline-none focus:border-white"
          placeholder="Use **bold** for headings. Shown in the Project info drawer."
        />
      </label>

      <label className="flex items-center gap-3 text-sm text-white/70">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
          className="size-4"
        />
        Featured on homepage
      </label>

      <div>
        <p className="mb-2 text-sm text-white/60">Gallery</p>
        <p className="mb-4 text-xs text-white/40">
          Detail page horizontal/vertical gallery (order = 01, 02, 03…)
        </p>
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

      {project && (
        <p className="text-sm text-white/50">
          Drafts are not on the public site.{" "}
          <Link
            href={`/admin/projects/${project.id}/preview`}
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
