import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MonitoringCardSkeleton() {
  return (
    <Card className="transition-all shadow-none border-slate-100 border-[1px] rounded-sm pt-3">
      <CardContent className="flex flex-col justify-between p-6 h-full gap-4">
        <div className="flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 flex-1" />
          </div>
          <Skeleton className="h-12 w-[360px]" />
        </div>
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}
