"use client";

import { useAdminAction } from "@/components/admin/AdminActionProvider";

type Props = {
  label: string;
  value?: string | null;
  folder: "covers" | "gallery" | "media";
  onChange: (url: string) => void;
  onClear?: () => void;
};

export default function ImageField({
  label,
  value,
  folder,
  onChange,
  onClear,
}: Props) {
  const { runAction } = useAdminAction();

  const upload = async (file: File) => {
    await runAction("Uploading image", async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Upload failed");
      }
      onChange(result.data.url);
      return result;
    });
  };

  return (
    <div>
      <p className="mb-2 text-sm text-white/60">{label}</p>
      {value ? (
        <div className="relative overflow-hidden border border-white/10">
          <img src={value} alt="" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-3 bg-black/70 px-3 py-1 text-xs"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex h-40 cursor-pointer items-center justify-center border border-dashed border-white/15 text-sm text-white/40 hover:border-white/40 hover:text-white">
          Upload image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                upload(file).catch((error) => {
                  window.alert(error instanceof Error ? error.message : "Upload failed");
                });
              }
              event.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}
