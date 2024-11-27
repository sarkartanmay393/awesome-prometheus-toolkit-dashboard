"use client";

import { Card, CardContent } from "@/components/ui/card";
import PrometheusModal from "./rule-details-modal";
import type { Service } from "@/types";
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import GetDefaultSrvIcon from "@/assets/getDefaultSrvIcon";
import SVGWrapper from "./svg-wrapper";

interface MonitoringCardProps {
  service: Service;
}

export function MonitoringCard({ service }: MonitoringCardProps) {
  const SimpleIconElement = service.icon.length > 0 ? SimpleIcons[
    service.icon as keyof typeof SimpleIcons
  ] as SimpleIcons.IconType : null;
  const CraftedIcon = SimpleIconElement ? (
    <SimpleIconElement
      color={
        SimpleIcons[`${service.icon}Hex` as keyof typeof SimpleIcons] as string
      }
    />
  ) : null;

  return (
    <Card className="transition-all shadow-none rounded-sm">
      <CardContent className="flex flex-col justify-between p-6 h-full gap-4 ">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {CraftedIcon ? CraftedIcon : <SVGWrapper svgCode={GetDefaultSrvIcon()} width={20} height={20} />}
            <h3 className="font-bold text-md text-slate-600 truncate">
              {service?.name}
            </h3>
          </div>
          <p className="text-xs text-slate-400 overflow-hidden text-ellipsis line-clamp-3">
            <span className="p-1 rounded-full px-1.5 bg-slate-100 uppercase text-slate-400 font-bold text-xs mr-1.5">
              {service?.exporters?.reduce(
                (acc, curr) => acc + (curr?.rules?.length || 0),
                0
              )}{" "}
              Rules
            </span>
            {service?.description}
          </p>
        </div>
        <PrometheusModal service={{ ...service }} />
      </CardContent>
    </Card>
  );
}
