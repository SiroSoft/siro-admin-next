"use client";

import { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import { Users, ShoppingCart, DollarSign, Package, TrendingUp, TrendingDown, Plus, Eye, Settings, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/error-state";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/use-dashboard";
import type { components } from "@/types/api";

type DashboardStats = components["schemas"]["DashboardStatsResponse"];

function StatCard({ title, value, icon: Icon, trend, href }: { title: string; value: string; icon: any; trend?: { value: string; up: boolean }; href?: string }) {
  const content = (
    <Card className="transition-colors hover:bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className={cn("flex items-center gap-1 mt-1 text-xs", trend.up ? "text-emerald-500" : "text-destructive")}>
            {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboard();
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleRefresh = useCallback(() => {
    refetch();
    setLastChecked(new Date());
  }, [refetch]);

  const stats = useMemo(
    () => [
      { title: "Total Users", value: formatNumber(data?.total_users ?? 0), icon: Users, href: "/users" },
      { title: "Total Orders", value: formatNumber(data?.total_orders ?? 0), icon: ShoppingCart, href: "/orders" },
      { title: "Total Products", value: formatNumber(data?.total_products ?? 0), icon: Package, href: "/products" },
      { title: "Revenue", value: `$${formatNumber(data?.total_revenue ?? 0)}`, icon: DollarSign, href: "/orders", trend: { value: "+12.5%", up: true } },
    ],
    [data],
  );

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your application">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </PageHeader>
        <ErrorState onRetry={() => refetch()} message={(error as Error)?.message} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your application">
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-2 w-2 mt-2 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.recent_activity && data.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {data.recent_activity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} &middot; {formatRelativeTime(activity.created_at!)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">API Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : data?.api_status ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <StatusBadge status={data.api_status.status ?? "down"} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm font-medium">{data.api_status.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium">{Math.round((data.api_status.uptime ?? 0) / 3600)}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">{data.api_status.response_time}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Checked</span>
                    <span className="text-sm font-medium">{lastChecked ? formatRelativeTime(lastChecked) : "–"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">API status unavailable</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/users">
                <Button variant="outline" className="w-full justify-start"><Plus className="mr-2 h-4 w-4" /> New User</Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="w-full justify-start"><Eye className="mr-2 h-4 w-4" /> View Orders</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="w-full justify-start"><Package className="mr-2 h-4 w-4" /> Manage Products</Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline" className="w-full justify-start"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : isError ? (
            <p className="text-muted-foreground text-center py-8">Failed to load revenue data</p>
          ) : data?.monthly_revenue && data.monthly_revenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthly_revenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No revenue data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
