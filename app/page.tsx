

import { MonitoringCard } from "@/components/monitoring-card";
import { readAlertRulesFromFS } from "@/lib/parser";
import { AlertCircle } from "lucide-react";


export default async function Home() {

  const monitoringItems = await readAlertRulesFromFS()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 grid grid-cols-3 gap-4">
        {monitoringItems.map((item, index) => (
          <MonitoringCard
            key={index}
            title={item.title}
            description={item.description}
            icon={item?.icon ?? <></>}
            alerts={item.alerts}
          />
        ))}
      </div>
    </main>
  );
}
