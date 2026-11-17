import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listAllJournals } from "@/lib/journals";
import { collectJournalStoragePaths } from "@/lib/journalMedia";
import {
  deleteStoragePath,
  listAllBucketMedia,
  normalizeStoragePath,
} from "@/lib/storageMedia";
import { formatAdminActionError } from "@/lib/userFacingErrors";

function pathsInUseByJournals() {
  const used = new Set<string>();
  return listAllJournals().then((rows) => {
    for (const row of rows) {
      for (const path of collectJournalStoragePaths(row)) {
        used.add(path);
      }
    }
    return used;
  });
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const [files, inUse] = await Promise.all([
      listAllBucketMedia(),
      pathsInUseByJournals(),
    ]);

    return NextResponse.json({
      success: true,
      data: files.map((file) => ({
        ...file,
        inUse: inUse.has(file.path),
      })),
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: formatAdminActionError(err, "Failed to load media"),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { path, force } = await request.json();
    if (!path || typeof path !== "string") {
      return NextResponse.json(
        { success: false, message: "Path is required" },
        { status: 400 }
      );
    }

    const normalized = normalizeStoragePath(path);
    const inUse = await pathsInUseByJournals();
    if (inUse.has(normalized) && !force) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This file is still used in a journal. Remove it from the post first, or confirm forced delete.",
          inUse: true,
        },
        { status: 409 }
      );
    }

    await deleteStoragePath(normalized);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: formatAdminActionError(err, "Failed to delete file"),
      },
      { status: 500 }
    );
  }
}
