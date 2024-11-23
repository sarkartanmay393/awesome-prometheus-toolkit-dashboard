"use client";

import { useContext } from "react";

import { Service } from "@/types";
import { Search } from "@/components/search";
import { MonitoringCard } from "@/components/monitoring-card";

import useSearch from "@/hooks/use-search";
import { GlobalContext } from "@/app/context";
import HompageSkeleton from "@/components/home-page-skeleton";

export default function Home() {
  const { data, onSearch } = useSearch();
  const { initialLoading } = useContext(GlobalContext);

  return (
    <main className="flex flex-col py-12 gap-4">
      <h2 className="text-slate-600 font-[500] text-[20px]">Browse Library</h2>
      <Search onSearch={onSearch} />
      <div className="flex flex-col gap-4 w-full">
        {initialLoading ? (
          <HompageSkeleton />
        ) : data.length < 1 ? (
          <p>No items found!</p>
        ) : (
          data.map((group) => (
            <div key={group.groupName} className="mb-6 gap-4 flex flex-col">
              <h4 className="text-slate-400 font-[700] text-[10px] uppercase">
                {group.groupName}
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.services?.map((service: Service, index) => {
                  return (
                    <MonitoringCard key={index} service={service as any} />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
