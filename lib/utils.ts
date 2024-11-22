import { Rule, Service } from "@/types";
import { type ClassValue, clsx } from "clsx";
import jsYaml from "js-yaml";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: will learn the function
export function getMatchingIcon(service: Service, iconList: string[]): string | undefined {
  const serviceText = `${service.name} ${service.description}`.toLowerCase();
  let bestMatch: string | undefined;
  let highestScore = 0;

  iconList.forEach(iconName => { // o(n)
    const iconNameLower = iconName.toLowerCase(); // can be optimised as this doesn't change often
    let score = 0;

    if (serviceText.includes(iconNameLower)) { // o(m)
      score = iconNameLower.length;
    } else {
      const nameWords = service.name?.toLowerCase().split(' ') || [];
      const descriptionWords = service.description?.toLowerCase().split(' ') || [];
      const allWords = [...nameWords, ...descriptionWords]; // k elements
      const allWordsSet = new Set(allWords);

      allWordsSet.forEach(word => { // o(k) - lets reduct to o(1)
        if (iconNameLower.includes(word)) { //o(l)
          score += word.length;
        }
      });
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = iconName;
    }
  });

  return bestMatch;
}

export const convertRuleToYamlString = (rule: Rule): string => {
  const yamlObject = {
    alert: rule.alert,
    expr: rule.expr,
    for: rule.for,
    labels: rule.labels,
    annotations: rule.annotations,
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
