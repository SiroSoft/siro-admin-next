import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string | number | boolean | null;
}

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" | "default" }> = {
  active: { label: "Active", variant: "success" },
  approved: { label: "Approved", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  published: { label: "Published", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "warning" },
  inactive: { label: "Inactive", variant: "secondary" },
  suspended: { label: "Suspended", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  archived: { label: "Archived", variant: "secondary" },
  admin: { label: "Admin", variant: "default" },
  user: { label: "User", variant: "secondary" },
  editor: { label: "Editor", variant: "warning" },
  viewer: { label: "Viewer", variant: "secondary" },
  healthy: { label: "Healthy", variant: "success" },
  degraded: { label: "Degraded", variant: "warning" },
  down: { label: "Down", variant: "destructive" },
};

function normalizeStatus(status: string | number | boolean | null | undefined): string {
  if (status === null || status === undefined) return "";
  if (typeof status === "boolean") return status ? "active" : "inactive";
  if (typeof status === "number") return status === 1 ? "active" : "inactive";
  return String(status);
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  if (!normalized) return null;
  const config = statusMap[normalized.toLowerCase()] ?? { label: normalized, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
