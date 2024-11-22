"use client";

import { Search } from "@/components/search";
import { MonitoringCard } from "@/components/monitoring-card";
import { Fragment } from "react";
import { Service } from "@/types";

import * as icons from "simple-icons";
import { getMatchingIcon } from "@/lib/utils";
import useSearch from "@/hooks/use-search";
const ICONS = Object.keys(icons);

export default function Home() {
  const { data, searchValue, onChange } = useSearch();

  return (
    <main className="flex flex-col py-12 gap-4">
      <h2 className="text-slate-600 font-[500] text-[20px]">Browse Library</h2>
      <Search searchValue={searchValue} onChange={onChange} />
      <div className="flex flex-col gap-4">
        {data.map((group) => (
          <Fragment key={group.groupName}>
            <h4 className="text-slate-400 font-[700] text-[10px] uppercase">
              {group.groupName}
            </h4>
            <div className="mx-auto grid grid-cols-3 gap-6">
              {group.services?.map((service: Service, index) => {
                const icon = getMatchingIcon(service, ICONS);
                service.icon = icon
                  ? icons[icon as keyof typeof icons].svg
                  : "";
                return <MonitoringCard key={index} service={service as any} />;
              })}
            </div>
          </Fragment>
        ))}
      </div>
      <footer className="w-full flex flex-col items-center pt- 4 justify-center font-thin"></footer>
    </main>
  );
}
