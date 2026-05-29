import { StatsSkeleton, TableSkeleton } from "@/components/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <StatsSkeleton />
      <TableSkeleton />
    </div>
  );
}
