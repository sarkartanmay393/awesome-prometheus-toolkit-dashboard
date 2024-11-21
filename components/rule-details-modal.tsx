"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { LightbulbIcon as LucideProps } from "lucide-react";
import dynamic from "next/dynamic";

const XIcon = dynamic(() => import("lucide-react").then((mod) => mod.X));
const CopyIcon = dynamic(() => import("lucide-react").then((mod) => mod.Copy));
const CheckIcon = dynamic(() =>
  import("lucide-react").then((mod) => mod.Check)
);

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RuleDetailsProps } from "@/types";

type PrometheusModalProps = {
  rules?: any[];
};

export default function PrometheusModal({ rules = [] }: PrometheusModalProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          View Alert Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Card className="w-full max-w-lg bg-white">
          <CardHeader className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold">
                Prometheus self-monitoring
              </h1>
              <span className="text-sm text-muted-foreground">
                {rules.length} RULES
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              //   onClick={() => setIsOpen(false)}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4 overflow-auto">
            {rules.map((rule) => (
              <div key={rule.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium">
                    {String(rule.id).padStart(2, "0")}
                  </div>
                  <h2 className="text-sm font-medium">{rule.title}</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  {rule.description}
                </p>
                <div className="relative">
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {rule.code}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(rule.code, rule.id)}
                  >
                    {copiedId === rule.id ? (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
