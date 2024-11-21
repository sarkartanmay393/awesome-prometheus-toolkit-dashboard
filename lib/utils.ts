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

  iconList.forEach(iconName => {
    const iconNameLower = iconName.toLowerCase();
    let score = 0;

    if (serviceText.includes(iconNameLower)) {
      score = iconNameLower.length;
    } else {
      const nameWords = service.name?.toLowerCase().split(' ') || [];
      const descriptionWords = service.description?.toLowerCase().split(' ') || [];
      const allWords = [...nameWords, ...descriptionWords];

      allWords.forEach(word => {
        if (iconNameLower.includes(word)) {
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