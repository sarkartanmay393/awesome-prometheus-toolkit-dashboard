"use client";

import { Group } from "@/types";
import { GlobalContext } from "@/app/context";
import { useState, useEffect, useContext } from "react";
import CONSTANTS from "@/lib/constants";
import yaml from "js-yaml";

export default function useSearch() {
  const { setSearchLoading, setInitialLoading } = useContext(GlobalContext);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  let onSearch = (searchValue: string) => {
    if (searchValue) {
      setSearchLoading && setSearchLoading(true);
    } else {
      console.log("worker not available");
      setSearchLoading && setSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading && setInitialLoading(true);
      try {
        const lastObj = LocalStorage.get('finalDataObject');
        if (lastObj && Math.abs(Math.floor(new Date().getTime() / 1000) - Number(lastObj.timestamp)) < 999) {
          setFilteredData(lastObj.value);
          return;
        }
        const response = await fetch(CONSTANTS.raw.rules);
        const text = await response.text();
        const data = yaml.load(text) as { groups: Group[] };
        const finalDataObject = await formatAllData(data.groups);
        LocalStorage.set('finalDataObject', { timestamp: Math.floor(new Date().getTime() / 1000), value: finalDataObject });
        setFilteredData(finalDataObject);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (setSearchLoading) setSearchLoading(false);
        if (setInitialLoading) setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data: filteredData || [],
    onSearch,
  };
}

const LocalStorage = {
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

const formatAllData = async (groups: any) => {
  const formattedGroups = await Promise.all(groups?.map(async (group: any) => {
    const formattedGroup = {
      ...group,
      services: await Promise.all(group?.services?.map(async (service: any) => {
        const exporterJson = await fetchDistRules(service);
        return {
          ...service,
          description: service?.exporters?.[0]?.rules?.reduce(
            (acc: string, curr: any) => `${acc} ${curr.description}`,
            ""
          ),
          exporters: service?.exporters?.map((exporter: any) => {
            const exporterName = exporter?.slug?.replace(/-/g, '').toLowerCase();
            const matchingJson = exporterJson.find((json: any) => json?.name?.toLowerCase() === exporterName);
            return {
              ...exporter,
              rules: exporter?.rules?.map((rule: any) => {
                const ruleName = rule?.name?.replace(/\s+/g, '').toLowerCase();
                const matchingRule = matchingJson?.rules?.find((r: any) => r?.alert?.toLowerCase() === ruleName);
                return {
                  ...rule,
                  ...matchingRule,
                };
              }),
            };
          }),
        };
      })),
    };
    return formattedGroup;
  }));
  return formattedGroups;
};

const constructRulePathNames = (service: any) => {
  const serviceSlug = service?.name?.replace(/\s+/g, '-').toLowerCase();
  const exporterSlugs = service?.exporters?.map((exporter: any) => exporter?.slug || "");
  const ruleDirectory = `https://raw.githubusercontent.com/samber/awesome-prometheus-alerts/master/dist/rules/${serviceSlug}/`;
  return exporterSlugs?.map((slug: string) => `${ruleDirectory}${slug}.yml`);
};

async function fetchDistRules(service: any) {
  const rawPathsToDownload = constructRulePathNames(service);
  try {
    const responses = await Promise.all(rawPathsToDownload.map((path: string) => fetch(path)));
    const responseTexts = await Promise.all(responses.map((response) => response.text()));
    const jsons = responseTexts
      .map((yamlText) => yaml.load(yamlText))
      .map((json: any) => json?.groups)
      .reduce((acc, curr) => [...acc, curr?.[0]], []);
    return jsons;
  } catch (error) {
    console.error("Error fetching dist rules:", error);
    return [];
  }
}
