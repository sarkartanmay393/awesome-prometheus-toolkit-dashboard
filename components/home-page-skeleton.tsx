"use client";

import { Fragment } from "react";
import { Skeleton } from "./ui/skeleton";
import { Service } from "@/types";
import { getMatchingIcon } from "@/lib/utils";
import { MonitoringCardSkeleton } from "./monitoring-card-skeleton";
import * as icons from "simple-icons";
const ICONS = Object.keys(icons);

export default function HompageSkeleton() {
  return (
    <Fragment>
      <h4 className="text-slate-400 font-[700] text-[10px] uppercase">
        <Skeleton className="w-[220px] h-6" />
      </h4>
      <div className="mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[{}, {}, {}, {}, {}].map((service: Service) => {
          const icon = getMatchingIcon(service, ICONS);
          service.icon = icon ? icons[icon as keyof typeof icons].svg : "";
          return <MonitoringCardSkeleton />;
        })}
      </div>
    </Fragment>
  );
}
