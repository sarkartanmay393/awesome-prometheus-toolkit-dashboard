"use client";

import { useContext } from "react";

import { Search } from "@/components/search";
import { MonitoringCard } from "@/components/monitoring-card";

import useSearch from "@/hooks/use-search";
import { GlobalContext } from "@/app/context";
import HompageSkeleton from "@/components/home-page-skeleton";

export default function Home() {
  const { data, onSearch } = useSearch();
  const { initialLoading } = useContext(GlobalContext);

  return (
    <main className="container flex flex-col py-12 gap-4">
      <h2 className="text-slate-600 font-medium text-xl">Browse Library</h2>
      <Search onSearch={onSearch} />
      <div className="flex flex-col gap-4 w-full">
        {initialLoading ? (
          <HompageSkeleton />
        ) : data.length < 1 ? (
          <p className="text-slate-400 text-sm"> {"> "} No items found!</p>
        ) : (
          data.map((group) => (
            <div key={group.name} className="mb-6 gap-4 flex flex-col">
              <h4 className="text-slate-400 font-bold text-xs uppercase">
                {group.name}
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.services?.length < 1 ? (
                  <p className="text-slate-400 text-xs">No services found!</p>
                ) : (
                  group.services?.map((service: any, index: number) => {
                    return (
                      <MonitoringCard key={index} service={service as any} />
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
