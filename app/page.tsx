import { Search } from "@/components/search";
import { MonitoringCard } from "@/components/monitoring-card";
import PrometheusData from "@/assets/merged.json";
import { Fragment } from "react";
import { Service } from "@/types";

import * as icons from 'simple-icons';
import { getMatchingIcon } from "@/lib/utils";

export default async function Home() {
  const iconss = Object.keys(icons);
  return (
    <main className="flex flex-col py-12 gap-4">
      <h2 className="text-slate-600 font-[500] text-[20px]">Browse Library</h2>
      <Search />
      <div className="flex flex-col gap-4">
        {PrometheusData.map((group) => (
          <Fragment key={group.groupName}>
            <h4 className="text-slate-400 font-[700] text-[10px] uppercase">
              {group.groupName}
            </h4>
            <div className="mx-auto grid grid-cols-3 gap-6">
              {group.services?.map((service: Service, index) => {
                const icon = getMatchingIcon(service, iconss);
                service.icon = icon ? icons[icon as keyof typeof icons].svg : '';
                return <MonitoringCard key={index} service={service as any} />;
              })}
            </div>
          </Fragment>
        ))}
      </div>
      <footer className="w-full flex flex-col items-center pt- 4 justify-center font-thin">
        {/* -
        <p className="text-sm text-slate-500 font-normal">Assignment by @sarkartanmay393</p>
        - */}
      </footer>
    </main>
  );
}
