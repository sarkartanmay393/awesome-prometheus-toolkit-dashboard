export default {
  Github_Repo:
    "https://github.com/sarkartanmay393/awesome-prometheus-toolkit-dashboard",
  raw: {
    rules:
      "https://raw.githubusercontent.com/samber/awesome-prometheus-alerts/refs/heads/master/_data/rules.yml",
    dist: "https://api.github.com/repos/samber/awesome-prometheus-alerts/contents/dist",
  },
};

export const THRESHOLD = 0.65;
export const FuseOptions = {
  keys: [
    "name",
    "services.name",
    "services.description",
    "services.exporters.slug",
    "services.exporters.rules.name",
    "services.exporters.rules.description",
    "services.exporters.rules.query",
    "services.exporters.rules.severity",
    "services.exporters.rules.expr",
    "services.exporters.rules.for",
    "services.exporters.rules.alert",
    "services.exporters.rules.labels",
  ],
  threshold: THRESHOLD,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: true,
};

import * as icons from "@icons-pack/react-simple-icons";
export const ICONS = Object.keys(icons).filter((icon) => !icon.toLowerCase().includes('hex'));