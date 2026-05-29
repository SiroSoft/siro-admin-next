import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string;
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
  editor: { label: "Editor", variant: "warning" },
  viewer: { label: "Viewer", variant: "secondary" },
  healthy: { label: "Healthy", variant: "success" },
  degraded: { label: "Degraded", variant: "warning" },
  down: { label: "Down", variant: "destructive" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;
  const config = statusMap[status.toLowerCase()] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
