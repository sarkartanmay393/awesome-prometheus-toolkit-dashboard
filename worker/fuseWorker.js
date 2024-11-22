import Fuse from "fuse.js";
import MergedJson from "../assets/merged.json";

const THRESHOLD = 0.2;
const FuseOptions = {
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

let fuseInstance;

onmessage = function (e) {
  const { type, searchValue } = e.data;

  switch (type) {
    case "init": {
      fuseInstance = new Fuse(MergedJson, FuseOptions);
      console.log(`worker, type: 'init', status: 'initialized'`);
      postMessage({ type: "init", results: MergedJson });
    }
    case "search": {
      if (fuseInstance) {
        if (!searchValue?.trim()) {
            postMessage({ type: "search", results: MergedJson });;
            return;
        }
        const fuzzyResult = fuseInstance.search(searchValue);
        const results = formatFuzzyResult(fuzzyResult);
        console.log(`worker, type: 'search', results: '[]'`);
        postMessage({ type: "search", results });
      }
    }
  }
};

const formatFuzzyResult = (fuzzyResult) => {
  return fuzzyResult.map((foundItem) => {
    const { matches, score = 1, item: group } = foundItem;
    const matchedServices = group.services.filter((service) => {
      return matches && matches.length
        ? matches.some(
            (match) =>
              FuseOptions.keys.includes(match.key ?? "") &&
              [group.groupName, service.name].includes(match.value ?? "") &&
              score <= 0.3
          )
        : true;
    });
    return {
      ...group,
      services: matchedServices,
    };
  });
};
