"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface MonitoringCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  alerts: number;
}

export function MonitoringCard({ title, description, icon, alerts }: MonitoringCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        {alerts > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">{alerts}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Alert Rules
        </Button>
      </CardFooter>
    </Card>
  );
}