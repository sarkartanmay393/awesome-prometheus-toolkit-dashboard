"use server";

import path from "path";
import fs from "fs";
import jsYaml from "js-yaml";
import type { Exporter, Group, Rule } from "@/types";

const parseMainYaml = (filePath: string): Group[] => {
  const yamlContent = fs.readFileSync(filePath, "utf8");
  const parsedYaml = jsYaml.load(yamlContent) as { groups: Group[] };
  return parsedYaml.groups;
};

const parseRuleFiles = (directoryPath: string) => {
  const rulesBySlug: {
    [slug: string]: {
      rules: Rule[];
      name: string;
    };
  } = {};

  const readDirectory = (dirPath: string) => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        readDirectory(filePath);
      } else if (file.endsWith(".yml") || file.endsWith(".yaml")) {
        const yamlContent = fs.readFileSync(filePath, "utf8");
        const parsedYaml = jsYaml.load(yamlContent) as { groups: Exporter[] };
        if (parsedYaml.groups) {
          parsedYaml.groups.forEach((exporter) => {
            const slug = file.slice(0, -4);
            if (!rulesBySlug[slug]) {
              rulesBySlug[slug] = {
                rules: [],
                name: "",
              };
            }
            rulesBySlug[slug] = {
              rules: exporter?.rules ?? [],
              name: exporter?.name ?? "",
            };
          });
        }
      }
    });
  };

  readDirectory(directoryPath);
  return rulesBySlug;
};

// each service is a directory in the rules directiory
//
const mergeData = (
  groups: Group[],
  rulesBySlug: { [slug: string]: { rules: Rule[]; name: string } }
) => {
  return groups?.map((group) => ({
    groupName: group.groupName,
    services: group.services.map((service) => ({
      name: service.name,
      description: service?.exporters
        ?.flatMap((exp) => exp.rules?.map((r) => r.description))
        .join(", "),
      totalRules: service?.exporters?.flatMap((exp) => exp.rules).length,
      exporters: service?.exporters?.map((exporter) => {
        const exactExporterFromRulesBySlug = rulesBySlug[exporter?.slug ?? ""];
        const exactRulesFromRulesBySlug = exactExporterFromRulesBySlug.rules;
        return {
          name: exactExporterFromRulesBySlug.name,
          slug: exporter.slug,
          rules: exporter.rules?.map((rule) => {
            const correspondingRule = exactRulesFromRulesBySlug.find((r) =>
              r?.annotations?.summary?.includes(rule.name)
            );
            return {
              name: rule.name,
              description: rule.description,
              query: rule.query,
              severity: rule.severity,
              ...correspondingRule,
            };
          }),
        };
      }),
    })),
  }));
};

export const main = () => {
  const mainYamlPath = path.join(process.cwd(), "assets/rules.yml");
  const ruleDirectoryPath = path.join(process.cwd(), "assets/rules");

  const groups = parseMainYaml(mainYamlPath);
  const rulesBySlug = parseRuleFiles(ruleDirectoryPath);

  fs.writeFileSync(
    path.join(process.cwd(), "assets/groupss.json"),
    JSON.stringify(groups, null, 2)
  );
  fs.writeFileSync(
    path.join(process.cwd(), "assets/rulesBySlugg.json"),
    JSON.stringify(rulesBySlug, null, 2)
  );

  const mergedData = mergeData(groups, rulesBySlug);
  fs.writeFileSync(
    path.join(process.cwd(), "assets/merged.json"),
    JSON.stringify(mergedData, null, 2)
  );

  console.log(JSON.stringify(mergedData, null, 2));
};
