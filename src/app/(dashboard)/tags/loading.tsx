import { TableSkeleton } from "@/components/loading-skeleton";

export default function TagsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-10 w-full animate-pulse rounded bg-muted" />
      <TableSkeleton />
    </div>
  );
}
