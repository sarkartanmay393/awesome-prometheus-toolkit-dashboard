"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useState } from "react";
import dynamic from "next/dynamic";

const CopyIcon = dynamic(() => import("lucide-react").then((mod) => mod.Copy));
const CheckIcon = dynamic(() =>
  import("lucide-react").then((mod) => mod.Check)
);

import { Button } from "@/components/ui/button";
import { Rule, Service } from "@/types";
import { cn, convertRuleToYamlString } from "@/lib/utils";

type PrometheusModalProps = {
  service?: Service;
};

export default function PrometheusModal({ service }: PrometheusModalProps) {
  const [copiedId, setCopiedId] = useState<string>("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };


  // hack
  if (service?.exporters?.[0].rules) {
    service.exporters[0].rules =
      (service?.exporters?.[0]?.rules?.length ?? 0) < 3
        ? [...service?.exporters?.[0]?.rules, {} as Rule, {} as Rule, {} as Rule, {} as Rule]
        : service?.exporters?.[0]?.rules;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-slate-200 text-slate-600 text-[12px] font-[600]"
        >
          View Alert Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95%] sm:max-w-[784px] h-[556px] rounded-sm p-0 gap-0 overflow-hidden ">
        {/* <div className="overflow-y-scroll"> */}
        <div className="flex flex-col py-4 gap-2 h-[56px] border-black">
          <div className="flex items-center max-h-[56px] px-6">
            <div className="flex items-center gap-2">
              {service?.icon}
              <h3 className="font-[700] text-md text-slate-600">
                {service?.name}
              </h3>
              <span className="hidden sm:block p-1 rounded-full px-1.5 bg-slate-100 uppercase text-slate-400 font-[700] text-[10px]">
                {service?.totalRules ?? 0} Rules
              </span>
            </div>
          </div>
          <hr className="w-full m-0 p-0" />
        </div>

        <div className="px-6 py-4 space-y-6 overflow-y-scroll overflow-x-hidden border-black h -[500px]">
          {service?.exporters?.[0]?.rules?.map((rule, count) => (
            <RuleView
              key={count}
              rule={rule}
              count={count}
              copiedId={copiedId}
            />
          ))}
        </div>
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
}

const RuleView = ({ rule, count, copiedId }: any) => {
  const code = convertRuleToYamlString(rule);
  return (
    <div className="flex gap-4 bo rder border-red-500">
      {/* count */}
      <div className={cn("flex items-start justify-center", Object.keys(rule).length < 1 ? 'invisible' : '')}>
        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-slate-100 text-slate-500 text-[12px] font-[700]">
          {String(++count).padStart(2, "0")}
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-[14px] font-[500] text-slate-600">
            {rule?.name}
          </h2>
          <p className="text-[12px] text-slate-500 font-[500]">
            {rule?.description}
          </p>
        </div>
        {/* codeblock */}
        <div className={cn("bo rder border-red-500 relative", code.trim()=='{}' ? 'hidden' : '')}>
          <pre role='contentinfo' className="bg-slate-50 p-2 rounded text-xs overflow-x-scroll" style={{ whiteSpace: 'pre-wrap' }}>
            {code}
          </pre>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            // onClick={() => copyToClipboard(rule.code, rule.id)}
          >
            {copiedId === rule?.name ? (
              <>
                <CheckIcon className="w-4 h-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
