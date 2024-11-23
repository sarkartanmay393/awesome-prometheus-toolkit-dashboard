"use client";

import { Group } from "@/types";
import { GlobalContext } from "@/app/context";
import { useState, useEffect, useContext } from "react";

export default function useSearch() {
  const { setSearchLoading, setInitialLoading } = useContext(GlobalContext);
  const [filteredData, setFilteredData] = useState<Group[]>([]);
  const [worker, setWorker] = useState<Worker | null>(null);

  let onSearch = (searchValue: string) => {
    if (worker) {
      setSearchLoading && setSearchLoading(true);
      worker.postMessage({ type: "search", searchValue });
    } else {
      console.log("worker not available");
      setSearchLoading && setSearchLoading(false);
    }
  };

  useEffect(() => {
    const newWorker = new Worker(
      new URL("../worker/fuseWorker.js", import.meta.url)
    );

    newWorker.postMessage({ type: "init" });

    newWorker.onmessage = (e) => {
      // console.log("react onmessage", e);
      const { type, results } = e.data;
      switch (type) {
        case "search": {
          setFilteredData(results || []);
          setSearchLoading && setSearchLoading(false);
        }
        case "init": {
          console.log("worker connection established!");
          setFilteredData(results || []);
          setSearchLoading && setSearchLoading(false);
          setInitialLoading && setInitialLoading(false);
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
  };
}
