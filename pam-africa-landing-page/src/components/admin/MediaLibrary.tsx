"use client";

import { useEffect, useState } from "react";
import AdminMediaSkeleton from "@/components/admin/AdminMediaSkeleton";
import { useAdminAction } from "@/components/admin/AdminActionProvider";

type MediaItem = {
  name: string;
  path: string;
  url: string;
  inUse?: boolean;
  createdAt?: string;
  size?: number | null;
};

export default function MediaLibrary() {
  const { runAction } = useAdminAction();
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/media");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load media");
      }
      setFiles(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (file: File) => {
    await runAction("Uploading file", async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "media");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }
      await load();
      return result;
    });
  };

  const remove = async (file: MediaItem) => {
    const msg = file.inUse
      ? `"${file.name}" is used in a journal. Delete anyway? The post may show a broken image.`
      : `Delete "${file.name}"?`;
    if (!window.confirm(msg)) return;

    const tryDelete = async (force: boolean) => {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: file.path, force }),
      });
      const result = await response.json();
      if (response.status === 409 && result.inUse && !force) {
        if (
          window.confirm(
            `${result.message}\n\nDelete the file from storage anyway?`
          )
        ) {
          return tryDelete(true);
        }
        return null;
      }
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Delete failed");
      }
      return result;
    };

    await runAction("Deleting file", async () => {
      const result = await tryDelete(Boolean(file.inUse));
      if (result) await load();
      return result;
    }).catch((err) => {
      window.alert(err instanceof Error ? err.message : "Delete failed");
    });
  };

  return (
    <div>
      <label className="inline-flex cursor-pointer bg-white px-5 py-3 text-sm text-black">
        Upload file
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              upload(file).catch((err) => {
                window.alert(err instanceof Error ? err.message : "Upload failed");
              });
            }
            event.target.value = "";
          }}
        />
      </label>

      {error && (
        <p className="mt-6 border border-white/10 bg-white/5 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      {loading ? (
        <AdminMediaSkeleton />
      ) : files.length === 0 ? (
        <p className="mt-8 text-white/40">No files uploaded yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <article key={file.path} className="border border-white/10 bg-[#131313]">
              <img src={file.url} alt={file.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="truncate text-sm">{file.name}</p>
                <p className="mt-1 truncate text-xs text-white/40">{file.path}</p>
                {file.inUse && (
                  <p className="mt-2 text-xs text-amber-200/90">Used in a journal</p>
                )}
                <div className="mt-4 flex gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(file.url)}
                    className="underline underline-offset-4"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(file)}
                    className="text-white/50 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
