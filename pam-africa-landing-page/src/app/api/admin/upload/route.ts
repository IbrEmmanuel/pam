import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { JOURNAL_MEDIA_BUCKET } from "@/lib/supabase/env";

const FOLDERS = new Set(["covers", "gallery", "body", "media"]);

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = String(formData.get("folder") || "media");
    const folder = FOLDERS.has(folderValue) ? folderValue : "media";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "A file is required" },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.\-]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const path = `${folder}/${Date.now()}-${safeName || `image.${extension}`}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = createSupabaseAdminClient();
    const { error: uploadError } = await supabase.storage
      .from(JOURNAL_MEDIA_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(JOURNAL_MEDIA_BUCKET).getPublicUrl(path);

    return NextResponse.json({
      success: true,
      data: {
        path,
        url: publicUrl,
        name: file.name,
      },
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
