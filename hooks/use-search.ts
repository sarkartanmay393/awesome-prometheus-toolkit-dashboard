"use client";

import { useState, useEffect } from "react";
import PrometheusData from "@/assets/merged.json";
import { Group } from "@/types";

export default function useSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState<Group[]>([]);
  const [worker, setWorker] = useState<Worker | null>(null);

  let onSearch = (searchValue: string) => {
    if (worker) {
      setIsSearching(true);
      if (searchValue.trim()) {
        worker.postMessage({ type: "search", searchValue });
      } else {
        setFilteredData(PrometheusData);
        setIsSearching(false);
      }
    } else {
      console.log("worker not available");
    }
  };

  useEffect(() => {
    const newWorker = new Worker(
      new URL("../worker/fuseWorker.js", import.meta.url)
    );

    newWorker.postMessage({
      type: "init",
      data: PrometheusData
    });

    newWorker.onmessage = (e) => {
      // console.log("react onmessage", e);
      const { type, results } = e.data;
      switch (type) {
        case "search": {
          setFilteredData(results || []);
          setIsSearching(false);
        }
        case "init": {
          console.log("worker connection established!");
          setFilteredData(results || []);
        }
      }
    };

    setWorker(newWorker);

    return () => {
      console.log("Terminating worker");
      newWorker.terminate();
    };
  }, []);

  return {
    data: filteredData,
    onSearch,
    isSearching,
  };
}
