"use client";

import { Search } from "@/components/search";
import { MonitoringCard } from "@/components/monitoring-card";
import { Fragment } from "react";
import { Service } from "@/types";

import * as icons from "simple-icons";
import { getMatchingIcon } from "@/lib/utils";
import useSearch from "@/hooks/use-search";
import { Loader2Icon } from "lucide-react";
const ICONS = Object.keys(icons);

// console.log('home', new Date().getSeconds())
export default function Home() {
  // console.log('home inside', new Date().getSeconds())
  const { data, onSearch, isSearching } = useSearch();
  // console.log('home inside after useSearch', new Date().getSeconds())

  return (
    <main className="flex flex-col py-12 gap-4">
      <h2 className="text-slate-600 font-[500] text-[20px]">Browse Library</h2>
      <Search onSearch={onSearch} />
      <div className="flex flex-col gap-4">
        {isSearching ? (
          <Loader2Icon className="animate-spin duration-300 w-8 h-8" />
        ) : data.length < 1 ? (
          <p>No items found!</p>
        ) : (
          data.map((group) => (
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
                  return (
                    <MonitoringCard key={index} service={service as any} />
                  );
                })}
              </div>
            </Fragment>
          ))
        )}
      </div>
      <footer className="w-full flex flex-col items-center pt- 4 justify-center font-thin"></footer>
    </main>
  );
}
