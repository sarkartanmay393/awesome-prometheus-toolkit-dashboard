import { Search } from "@/components/search";
import { MonitoringCard } from "@/components/monitoring-card";
import PrometheusData from "@/assets/merged.json";
import { Fragment } from "react";

export default async function Home() {
  return (
    <main className="flex flex-col py-12 gap-[16px]">
      <h2 className="text-[#475569] font-[500] text-[20px]">Browse Library</h2>
      <Search />
      <div className="flex flex-col gap-6">
        {PrometheusData.map((group) => (
          <Fragment key={group.groupName}>
            <h4 className="text-[#94A3B8] font-[700] text-[10px] uppercase">{group.groupName}</h4>
            <div className="mx-auto grid grid-cols-3 gap-4">
              {group.services?.map((service, index) => (
                <MonitoringCard
                  key={index}
                  title={service.name}
                  description={service.description}
                  icon={<></>}
                  alerts={1}
                  monitoringItems={[]}
                  id={0}
                />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </main>
  );
}
