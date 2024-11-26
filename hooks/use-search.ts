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
        const response = await fetch(CONSTANTS.raw.rules);
        const text = await response.text();
        const data = yaml.load(text) as { groups: Group[] };
        setFilteredData(formatAllData(data.groups as any));
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

const formatAllData = (groups: any) => {
  return groups?.map((group: any) => {
    return {
      ...group,
      services: group?.services?.map((service: any) => {
        return {
          ...service,
          description: service?.exporters?.[0]?.rules?.reduce((acc: string, curr: any) => acc+' '+curr.description, ''), 
        };
      }),
    };
  });
};
