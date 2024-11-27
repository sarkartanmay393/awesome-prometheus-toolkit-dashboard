import { Group, Rule, Service } from "@/types";
import { type ClassValue, clsx } from "clsx";
import jsYaml from "js-yaml";
import { twMerge } from "tailwind-merge";
import { THRESHOLD, FuseOptions, ICONS } from "./constants";

export const LocalStorage = {
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get: (key: string) => {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  clear: () => {
    localStorage.clear();
  },
};

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

export const formatAllData = async (groups: any) => {
  const formattedGroups = await Promise.all(
    groups?.map(async (group: any) => {
      const formattedGroup = {
        ...group,
        services: await Promise.all(
          group?.services?.map(async (service: any) => {
            const exporterJson = await fetchDistRules(service);
            return {
              ...service,
              description: service?.exporters?.[0]?.rules?.reduce(
                (acc: string, curr: any) => `${acc} ${curr.description}`,
                ""
              ),
              exporters: service?.exporters?.map((exporter: any) => {
                const exporterName = exporter?.slug
                  ?.replace(/-/g, "")
                  .toLowerCase();
                const matchingJson = exporterJson.find(
                  (json: any) => json?.name?.toLowerCase() === exporterName
                );
                // console.log(exporterName, matchingJson)
                return {
                  ...exporter,
                  rules: exporter?.rules?.map((rule: any) => {
                    const ruleName = rule?.name
                      ?.replace(/\s+/g, "")
                      .toLowerCase();
                    const matchingRule = matchingJson?.rules?.find(
                      (r: any) => r?.alert?.toLowerCase() === ruleName
                    );
                    return {
                      ...rule,
                      ...matchingRule,
                    };
                  }),
                };
              }),
            };
          })
        ),
      };
      return formattedGroup;
    })
  );
  return addIconToMergedJson(formattedGroups);
};

export const constructExporterPathNames = (service: any) => {
  const serviceSlug = service?.name?.trim().replace(/\s+/g, "-").toLowerCase();
  const exporterSlugs = service?.exporters
    ?.map((exporter: any) => exporter?.slug || false)
    .filter(Boolean);
  const ruleDirectory = `https://raw.githubusercontent.com/samber/awesome-prometheus-alerts/master/dist/rules/${serviceSlug}/`;
  return exporterSlugs?.map((slug: string) => `${ruleDirectory}${slug}.yml`);
};

export async function fetchDistRules(service: any) {
  const rawPathsToDownload = constructExporterPathNames(service);
  try {
    const responses = await Promise.all(
      rawPathsToDownload.map((path: string) => fetch(path))
    );
    const responseTexts = await Promise.all(
      responses.map((response) => response.text())
    );
    const jsons = responseTexts
      .map((yamlText) => jsYaml.load(yamlText))
      .map((json: any) => json?.groups)
      .reduce((acc, curr) => [...acc, curr?.[0]], []);
    return jsons;
  } catch (error) {
    console.error("Error fetching dist rules:", error);
    return [];
  }
}

export const formatFuzzyResult = (fuzzyResult: any[]) => {
  return fuzzyResult.map((foundItem: any) => {
    const { matches, score = 1, item: group } = foundItem;
    const matchedServices = group.services.filter((service: any) => {
      return matches && matches.length
        ? matches.some(
            (match: any) =>
              FuseOptions.keys.includes(match.key ?? "") &&
              [group.groupName, service.name].includes(match.value ?? "") &&
              score <= THRESHOLD
          )
        : true;
    });
    return {
      ...group,
      services: matchedServices,
    };
  });
};

export const addIconToMergedJson = (mergedJson: Group[]): Group[] => {
  return mergedJson.map((group: Group) => ({
    ...group,
    services: group.services.map(addIconToService),
  }));
};

export const addIconToService = (service: Service): Service => {
  let icon = getMatchingIcon(service, ICONS) || "";
  icon = icon.includes("Hex") ? icon.replace("Hex", "") : icon;
  service.icon = icon;
  return service;
};

export function getMatchingIcon(
  service: Service,
  iconList: string[]
): string | undefined {
  const serviceText = service?.name?.toLowerCase() ?? "";
  let bestMatch: string | undefined;
  let highestScore = 0;

  iconList.forEach((iconName: string) => {
    const iconNameLower = iconName.toLowerCase().slice(2);
    let score = 0;

    if (serviceText.includes(iconNameLower)) {
      score = iconNameLower.length;
    } else {
      const nameWords = service.name?.toLowerCase().split(" ") || [];
      const allWordsSet = new Set(nameWords);

      allWordsSet.forEach((word: string) => {
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

  // console.log(bestMatch, highestScore)
  return highestScore > 2 ? hardcodedIconSet(service.name || '', bestMatch || '') : "";
}

const hardcodedIconSet = (srvName: string, bestMatch: string) => {
  switch (srvName) {
    case "Host and hardware": {
      return "";
    }
    case "S.M.A.R.T Device Monitoring": {
      return "";
    }
    case "Blackbox": {
      return "";
    }
    case "Patroni": {
      return "";
    }
    case "Docker containers": {
      return 'SiDocker';
    }
    case "SQL Server": {
      return "";
    }
    case "Windows Server": {
      return "";
    }
    default: {
      return bestMatch;
    }
  }
};
