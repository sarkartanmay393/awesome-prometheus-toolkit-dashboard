import Fuse from "fuse.js";
import MergedJson from "../assets/merged.json";

import * as icons from '@icons-pack/react-simple-icons';
const ICONS = Object.keys(icons);

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
      const modifiedJson = addIconToMergedJson(MergedJson);
      postMessage({ type: "init", results: modifiedJson });
    }
    case "search": {
      if (fuseInstance) {
        if (!searchValue?.trim()) {
          const modifiedJson = addIconToMergedJson(MergedJson);
            postMessage({ type: "search", results: modifiedJson });;
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

const addIconToMergedJson = (mergedJson) => {
  return mergedJson.map((group) => ({
    ...group,
    services: group.services.map(addIconEleToService),
  }))
}

const addIconEleToService = (service) => {
  let icon = getMatchingIcon(service, ICONS) || '';
  icon = icon.includes("Hex") ? icon.replace("Hex", "") : icon;
  service.icon = icon;
  return service;
};

function getMatchingIcon(service, iconList) {
  const serviceText = `${service.name} ${service.description}`.toLowerCase();
  let bestMatch;
  let highestScore = 0;

  iconList.forEach(iconName => { // o(n)
    const iconNameLower = iconName.toLowerCase(); // can be optimised as this doesn't change often
    let score = 0;

    if (serviceText.includes(iconNameLower)) { // o(m)
      score = iconNameLower.length;
    } else {
      const nameWords = service.name?.toLowerCase().split(' ') || [];
      const descriptionWords = service.description?.toLowerCase().split(' ') || [];
      const allWords = [...nameWords, ...descriptionWords]; // k elements
      const allWordsSet = new Set(allWords);

      allWordsSet.forEach(word => { // o(k) - lets reduct to o(1)
        if (iconNameLower.includes(word)) { //o(l)
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