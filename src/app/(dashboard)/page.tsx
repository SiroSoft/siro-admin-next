"use client";

import { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import { Users, ShoppingCart, DollarSign, Package, TrendingUp, TrendingDown, ArrowRight, Plus, Eye, Settings, RefreshCw, Activity, Server } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatNumber, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/use-dashboard";
import type { components } from "@/types/api";

type DashboardStats = components["schemas"]["DashboardStatsResponse"];

const iconColors: Record<string, string> = {
  Users: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  Orders: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  Products: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  Revenue: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function StatCard({ title, value, icon: Icon, href }: { title: string; value: string; icon: any; href?: string }) {
  const content = (
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer border-l-4 border-l-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={cn("rounded-xl p-3", iconColors[title] || "bg-muted")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight mt-1">{value}</p>
        </div>
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
        <ErrorState onRetry={() => refetch()} />
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {(activity.user ?? "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(activity.created_at!)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No recent activity" description="Activity will appear here as users interact with the system." />
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
            <CardContent className="grid gap-2">
              <Link href="/users/new" className="group">
                <Button variant="default" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" /> New User
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </Link>
              <Link href="/orders" className="group">
                <Button variant="secondary" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" /> View Orders
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </Link>
              <Link href="/products" className="group">
                <Button variant="secondary" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" /> Manage Products
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </Link>
              <Link href="/settings" className="group">
                <Button variant="secondary" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
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
            <ErrorState message="Failed to load revenue data" onRetry={() => refetch()} />
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
            <EmptyState title="No revenue data" description="Revenue data will appear once orders are placed." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
