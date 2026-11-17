import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminMediaSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="border border-white/10 bg-[#131313]">
          <Skeleton className="h-40 w-full rounded-none bg-white/10" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4 bg-white/10" />
            <Skeleton className="h-3 w-full bg-white/5" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-3 w-12 bg-white/5" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function AdminEditorSkeleton() {
  return (
    <div className="overflow-hidden border border-white/10 bg-[#0a0a0a]">
      <div className="flex flex-wrap gap-2 border-b border-white/10 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-10 bg-white/10" />
        ))}
      </div>
      <div className="min-h-[280px] space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={`h-3 bg-white/10 ${i === 3 ? "w-4/5" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

export function AdminTeamSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="border border-white/10">
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3 first:border-t-0"
        >
          <Skeleton className="h-4 w-48 bg-white/10" />
          <Skeleton className="h-6 w-24 bg-white/10" />
        </li>
      ))}
    </ul>
  );
}
