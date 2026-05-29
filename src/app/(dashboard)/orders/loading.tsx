import { TableSkeleton } from "@/components/loading-skeleton";

export default function OrdersLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <TableSkeleton />
    </div>
  );
}
