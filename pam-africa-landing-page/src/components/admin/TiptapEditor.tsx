"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { AdminEditorSkeleton } from "@/components/admin/AdminMediaSkeleton";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image,
      Placeholder.configure({
        placeholder: "Write the journal body…",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "min-h-[280px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const uploadInlineImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "body");
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Upload failed");
    }
    editor?.chain().focus().setImage({ src: result.data.url }).run();
  };

  if (!editor) {
    return <AdminEditorSkeleton />;
  }

  return (
    <div className="admin-editor overflow-hidden border border-white/10 bg-[#0a0a0a]">
      <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
        {[
          { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
          { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
          { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
          { label: "H4", action: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
          { label: "B", action: () => editor.chain().focus().toggleBold().run() },
          { label: "I", action: () => editor.chain().focus().toggleItalic().run() },
          { label: "Quote", action: () => editor.chain().focus().toggleBlockquote().run() },
          { label: "• List", action: () => editor.chain().focus().toggleBulletList().run() },
          { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run() },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.action}
            className="px-2.5 py-1 text-xs text-white/70 hover:bg-white hover:text-black"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const href = window.prompt("Link URL");
            if (!href) return;
            editor.chain().focus().setLink({ href }).run();
          }}
          className="px-2.5 py-1 text-xs text-white/70 hover:bg-white hover:text-black"
        >
          Link
        </button>
        <label className="cursor-pointer px-2.5 py-1 text-xs text-white/70 hover:bg-white hover:text-black">
          Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                uploadInlineImage(file).catch((error) => {
                  window.alert(error instanceof Error ? error.message : "Upload failed");
                });
              }
              event.target.value = "";
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
