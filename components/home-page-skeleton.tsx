"use client";

import { Fragment } from "react";
import { Skeleton } from "./ui/skeleton";
import { MonitoringCardSkeleton } from "./monitoring-card-skeleton";

export default function HompageSkeleton() {
  return (
    <Fragment>
      <h4 className="text-slate-400 font-[700] text-[10px] uppercase">
        <Skeleton className="w-[220px] h-6" />
      </h4>
      <div className="mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[{}, {}, {}, {}, {}].map((_, i) => {
          return <MonitoringCardSkeleton key={i} />;
        })}
      </div>
    </Fragment>
  );
}
