"use client";

import { Group } from "@/types";
import { GlobalContext } from "@/app/context";
import { useState, useEffect, useContext, useRef } from "react";
import CONSTANTS, { FuseOptions } from "@/lib/constants";
import yaml from "js-yaml";
import Fuse from "fuse.js";
import { formatAllData, formatFuzzyResult, LocalStorage } from "@/lib/utils";

export default function useSearch() {
  const { setSearchLoading, setInitialLoading } = useContext(GlobalContext);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [holdFilteredData, setHoldFilteredData] = useState<any[]>([]);
  const [fuseIns, setfuse] = useState<any | null>(null);

  let onSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      setSearchLoading && setSearchLoading(true);
      const matches = fuseIns.search(searchValue.trim());
      const results = formatFuzzyResult(matches);
      setFilteredData(results);
    } else {
      console.log("no search value");
      setFilteredData(holdFilteredData);
      setSearchLoading && setSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading && setInitialLoading(true);
      try {
        const lastObj = LocalStorage.get("finalDataObject");
        // if (
        //   lastObj &&
        //   Math.abs(
        //     Math.floor(new Date().getTime() / 1000) - Number(lastObj.timestamp)
        //   ) < 999
        // ) {
        //   setHoldFilteredData(lastObj.value);
        //   setFilteredData(lastObj.value);
        //   return;
        // }
        const response = await fetch(CONSTANTS.raw.rules);
        const text = await response.text();
        const data = yaml.load(text) as { groups: Group[] };
        const finalDataObject = await formatAllData(data.groups);
        LocalStorage.set("finalDataObject", {
          timestamp: Math.floor(new Date().getTime() / 1000),
          value: finalDataObject,
        });
        setHoldFilteredData(finalDataObject);
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

  useEffect(() => {
    if (Object.keys(holdFilteredData).length > 0) {
      const fuse = new Fuse(holdFilteredData, FuseOptions);
      setfuse(fuse);
    }
  }, [holdFilteredData]);

  return {
    data: filteredData || [],
    onSearch,
  };
}
