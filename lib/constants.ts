export default {
  Github_Repo:
    "https://github.com/sarkartanmay393/awesome-prometheus-toolkit-dashboard",
  raw: {
    rules:
      "https://raw.githubusercontent.com/samber/awesome-prometheus-alerts/refs/heads/master/_data/rules.yml",
    dist: "https://api.github.com/repos/samber/awesome-prometheus-alerts/contents/dist",
  },
};

export const THRESHOLD = 0.6;
export const FuseOptions = {
  keys: [
    "name",
    "services.name",
    "services.description",
    "services.exporters.name",
    "services.exporters.rules.name",
    "services.exporters.rules.description",
    "services.exporters.rules.query",
    "services.exporters.rules.severity",
  ],
  threshold: THRESHOLD,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: true,
};