import Fuse from "fuse.js";
import { useMemo, useState, useCallback } from "react";
import PrometheusData from "@/assets/merged.json";

const THRESHOLD = 0.2;
const fuseOptions = {
  keys: [
    "groupName",
    "services.name",
    // "services.description",
    // "services.exporters.name",
    // "services.exporters.rules.name",
    // "services.exporters.rules.description",
    // "services.exporters.rules.query",
    // "services.exporters.rules.severity",
  ],
  threshold: THRESHOLD,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: true,
};

export default function useSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState(PrometheusData);
  // console.log("before fuzzy instance creation", new Date().getSeconds());
  const fuseInstance = useMemo(() => new Fuse(PrometheusData, fuseOptions), []);
  // console.log("after fuzzy instance creation", new Date().getSeconds());

  const getFilteredData = useCallback(
    (searchValue: string) => {
      if (searchValue.length) {
        // console.log("fuzzy search started", new Date().getSeconds());
        const fuzeResult = fuseInstance.search(searchValue);
        // console.log("fuzzy search finished", new Date().getSeconds());
        // console.log('fuze', fuzeResult);
        // console.log("fuzzy result filtering", new Date().getSeconds());
        return fuzeResult.map((foundItem) => {
          const { matches, score = 1, item: group } = foundItem;
          const matchedServices = group.services.filter((service) => {
            return matches && matches.length
              ? matches.some(
                  (match) =>
                    fuseOptions.keys.includes(match.key ?? "") &&
                    [group.groupName, service.name].includes(
                      match.value ?? ""
                    ) &&
                    score <= THRESHOLD
                )
              : true;
          });
          // console.log("fuzzy result filtered", new Date().getSeconds());
          return {
            ...group,
            services: matchedServices,
          };
        });
      }
      return PrometheusData;
    },
    [fuseInstance]
  );

  const onSearch = (searchValue: string) => {
    // console.log("triggered onSearch", new Date().getSeconds());
    setIsSearching(true);
    // console.log('is searching')
    const data = getFilteredData(searchValue);
    setFilteredData(data);
    setIsSearching(false);
    // console.log(data)
    // console.log('searched')
  };

  return {
    data: filteredData,
    onSearch,
    isSearching,
  };
}
