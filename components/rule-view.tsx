"use client";

import { Button } from "@/components/ui/button";
import { cn, convertRuleToYamlString } from "@/lib/utils";
import { Check, Files } from "lucide-react";

const RuleView = ({ rule, count, copiedId, onCopy }: any) => {
  const code = convertRuleToYamlString(rule);
  return (
    <div className="flex gap-4 bo rder border-red-500">
      {/* count */}
      <div
        className={cn(
          "flex items-start justify-center",
          Object.keys(rule).length < 1 ? "invisible" : ""
        )}
      >
        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-slate-100 text-slate-500 text-[12px] font-[700]">
          {String(count + 1).padStart(2, "0")}
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col gap-4 bor der w-full">
        <div className="space-y-1">
          <h2 className="text-[14px] font-[500] text-slate-600">
            {rule?.name}
          </h2>
          <p className="text-[12px] text-slate-500 font-[500]">
            {rule?.description}
          </p>
        </div>
        {/* codeblock */}
        <div
          className={cn(
            "w-full bo rder border-red-500 relative",
            code.trim() == "{}" ? "hidden" : ""
          )}
        >
          <pre
            role="contentinfo"
            className="w-full bg-slate-50 rounded text-xs overflow-x-scroll p-6 pt-8"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {code}
          </pre>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-0 right-0 flex uppercase gap-[2px] bg-slate-100"
            onClick={() => onCopy(code, count)}
          >
            {copiedId === count ? (
              <>
                <Check className="w-[14px] h-[14px] text-green-500" />
                <p className="text-slate-500 font-[700] text-[10px]">Copied</p>
              </>
            ) : (
              <>
                <Files className="w-[12px] h-[12px] text-slate-500" />
                <p className="text-slate-500 font-[700] text-[10px]">Copy</p>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RuleView;
