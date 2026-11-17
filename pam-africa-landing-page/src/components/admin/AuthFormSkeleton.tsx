import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthFormSkeleton() {
  return (
    <div
      className="w-full max-w-md animate-pulse border border-white/10 bg-[#131313] p-8"
      aria-busy
      aria-label="Loading"
    >
      <Skeleton className="h-4 w-24 bg-white/10" />
      <Skeleton className="mt-4 h-9 w-48 bg-white/10" />
      <Skeleton className="mt-8 h-12 w-full bg-white/10" />
      <Skeleton className="mt-4 h-12 w-full bg-white/10" />
      <Skeleton className="mt-8 h-12 w-full bg-white/20" />
    </div>
  );
}
