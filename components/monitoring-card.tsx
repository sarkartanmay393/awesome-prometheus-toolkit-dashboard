"use client";

import { Card, CardContent } from "@/components/ui/card";
import PrometheusModal from "./rule-details-modal";
import type { Service } from "@/types";
import * as SimpleIcons from "@icons-pack/react-simple-icons";

interface MonitoringCardProps {
  service: Service;
}

export function MonitoringCard({ service }: MonitoringCardProps) {
  // const SimpleIconElement = SimpleIcons[
  //   service.icon as keyof typeof SimpleIcons
  // ] as SimpleIcons.IconType;
  // const CraftedIcon = (
  //   <SimpleIconElement
  //     color={
  //       SimpleIcons[`${service.icon}Hex` as keyof typeof SimpleIcons] as string
  //     }
  //   />
  // );

  return (
    <Card className="transition-all shadow-none border-slate-100 border-[1px] rounded-sm pt -3">
      <CardContent className="flex flex-col justify-between p-6 bo rder h-full gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {/* {CraftedIcon} */}
            <h3
              className="font-[700] text-md text-slate-600 truncate"
              style={{ whiteSpace: "wrap" }}
            >
              {service?.name}
            </h3>
          </div>
          <p className="text-[12px] text-slate-400 overflow-hidden text-ellipsis line-clamp-3">
            <span className="p-1 rounded-full px-1.5 bg-slate-100 uppercase text-slate-400 font-[700] text-[10px] mr-1.5">
              {service?.exporters?.[0]?.rules?.length || 0} Rules
            </span>
            {service?.description}
          </p>
        </div>
        <PrometheusModal service={{ ...service, icon: <></> }} />
      </CardContent>
    </Card>
  );
}
