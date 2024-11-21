"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import PrometheusModal from "./rule-details-modal";
import type { Service } from "@/types";
import SVGWrapper from "./svg-wrapper";

interface MonitoringCardProps {
  service: Service;
}

export function MonitoringCard({ service }: MonitoringCardProps) {
  return (
    <Card className="transition-all shadow-none border-slate-100 border-[1px] rounded-sm pt -3">
      <CardContent className="flex flex-col justify-between p-6 bo rder h-full gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <SVGWrapper
              svgCode={service.icon}
              alt={""}
              width={20}
              height={20}
            />
            <h3 className="font-[700] text-md text-slate-600">
              {service?.name}
            </h3>
          </div>
          <p className="text-[12px] text-slate-400">
            <span className="p-1 rounded-full px-1.5 bg-slate-100 uppercase text-slate-400 font-[700] text-[10px] mr-1.5">
              {service?.totalRules ?? 0} Rules
            </span>
            {service?.description?.slice(0, 180)}...
          </p>
        </div>
        <PrometheusModal service={service} />
      </CardContent>
    </Card>
  );
}
