"use client";

import { useState } from "react";

import { Rule, Service } from "@/types";
import RuleView from "@/components/rule-view";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type PrometheusModalProps = {
  service?: Service;
};

export default function PrometheusModal({ service }: PrometheusModalProps) {
  const [copiedId, setCopiedId] = useState<number>(-1);

  const copyToClipboard = (text: string, id: number) => {
    try {
      if (!window || !window.navigator) {
        throw new Error("not a client component");
      }
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(-1), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // hack
  if (service?.exporters?.[0].rules) {
    service.exporters[0].rules =
      (service?.exporters?.[0]?.rules?.length ?? 0) < 3
        ? [
            ...service?.exporters?.[0]?.rules,
            {} as Rule,
            {} as Rule,
            {} as Rule,
            {} as Rule,
          ]
        : service?.exporters?.[0]?.rules;
  }

  let ruleCounter = 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-slate-200 text-slate-600 text-xs font-semibold"
        >
          View Alert Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95%] sm:max-w-[784px] h-[556px] rounded-sm p-0 gap-0 overflow-hidden">
        <div className="flex flex-col py-4 gap-2 h-[56px] border-black">
          <div className="flex items-center max-h-[56px] px-6">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-md text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">
                {service?.name}
              </h3>
              <span className="hidden sm:block p-1 rounded-full px-1.5 bg-slate-100 uppercase text-slate-400 font-bold text-xs">
                {service?.exporters?.reduce(
                  (acc, curr) => acc + (curr?.rules?.length || 0),
                  0
                )}{" "}
                Rules
              </span>
            </div>
          </div>
          <hr className="w-full m-0 p-0" />
        </div>
        <div className="px-6 py-4 space-y-6 overflow-y-scroll overflow-x-hidden border-black h-[500px]">
          {service?.exporters?.flatMap((exp) => {
            return exp?.rules?.map((rule, count) => (
              <RuleView
                key={count}
                rule={rule}
                count={++ruleCounter}
                copiedId={copiedId}
                onCopy={copyToClipboard}
              />
            ));
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
