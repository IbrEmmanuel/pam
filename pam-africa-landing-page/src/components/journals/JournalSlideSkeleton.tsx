import { Skeleton } from "@/components/ui/Skeleton";

export default function JournalSlideSkeleton() {
  return (
    <main className="mx-auto px-2 md:px-4 py-10 animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="aspect-[16/10] w-full md:col-span-1" />
        <div className="flex flex-col justify-center space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-full max-w-md" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-4/5 max-w-lg" />
          <Skeleton className="mt-4 h-10 w-32" />
        </div>
      </div>
    </main>
  );
}
