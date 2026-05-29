import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent className="flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-5 w-32 mt-4" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent className="space-y-3">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
        </div>
      </div>
    </div>
  );
}
