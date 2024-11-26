import { Rule } from "@/types";
import { type ClassValue, clsx } from "clsx";
import jsYaml from "js-yaml";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertRuleToYamlString = (rule: Rule): string => {
  const yamlObject = {
    alert: rule?.alert,
    expr: rule?.expr,
    for: rule?.for,
    labels: rule?.labels,
    annotations: rule?.annotations,
  };

  return jsYaml.dump(yamlObject, { lineWidth: -1 });
};

export function createThrottler(fn: Function, delay: number) {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: any[]) {
    const now = Date.now();

    if (now - lastCall < delay) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = now;
        fn(...args);
      }, delay - (now - lastCall));
    } else {
      lastCall = now;
      fn(...args);
    }
  };
}