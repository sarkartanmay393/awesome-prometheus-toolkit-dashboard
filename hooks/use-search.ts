import Fuse from "fuse.js";
import { useMemo, useState, useCallback, useEffect } from "react";
import PrometheusData from "@/assets/merged.json";

const fuseOptions = {
  keys: [
    "groupName",
    "services.name",
    "services.description",
    // "services.exporters.name",
    // "services.exporters.rules.name",
    // "services.exporters.rules.description",
    // "services.exporters.rules.query",
    // "services.exporters.rules.severity",
  ],
};

function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: ReturnType<typeof setTimeout> | undefined;
  let lastRan: number | undefined;
  return function (this: unknown, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan! >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

const ThrottleLimit = 2000;

export default function useSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(PrometheusData);
  const fuseInstance = useMemo(() => new Fuse(PrometheusData, fuseOptions), []);

  const getFilteredData = useCallback(
    (searchValue: string) => {
      if (searchValue.length) {
        return fuseInstance.search(searchValue).map((found) => ({
          ...found.item,
        }));
      }
      return PrometheusData;
    },
    [fuseInstance]
  );

  const throttledGetFilteredData = useCallback(
    throttle((searchValue: string) => {
      setFilteredData(getFilteredData(searchValue));
    }, ThrottleLimit),
    [fuseInstance]
  );

  useEffect(() => {
    throttledGetFilteredData(searchValue);
  }, [searchValue, throttledGetFilteredData]);

  return {
    data: filteredData,
    searchValue,
    onChange: setSearchValue,
  };
}
