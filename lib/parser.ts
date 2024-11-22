"use server";

import path from "path";
import fs from "fs";
import jsYaml from "js-yaml";
import type { Exporter, Group, Rule, 
  // RuleYML
 } from "@/types";
// import { convertRuleToYamlString } from "./utils";

// export const readAlertRulesFromFS = async () => {
//   const monitoringItems: {
//     id: number;
//     title: string;
//     description: string;
//     icon?: JSX.Element;
//     alerts: number;
//     code: string;
//   }[] = [];

//   let groups: RuleYML["groups"] = [];

//   const rulesPathDir = path.join(process.cwd(), "/assets/rules");
//   const ruleGroupsOutPath = path.join(process.cwd(), "/assets", "groups.json");

//   const readFilesRecursively = (directory: string) => {
//     const files = fs.readdirSync(directory);
//     files.forEach((file) => {
//       const fullPath = path.join(directory, file);
//       if (fs.statSync(fullPath).isDirectory()) {
//         readFilesRecursively(fullPath);
//       } else if (file.endsWith(".yml") || file.endsWith(".yaml")) {
//         const yamlContent = fs.readFileSync(fullPath, "utf8");
//         const jsonData = jsYaml.load(yamlContent, { json: true }) as RuleYML;
//         groups = [...groups, ...jsonData?.groups];

//         // jsonData.groups.forEach((group) => {
//         jsonData?.groups?.[0]?.rules?.forEach((rule, i) => {
//           monitoringItems.push({
//             id: i,
//             title: rule.annotations.summary,
//             description: rule.annotations.description,
//             //   icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
//             alerts: 1,
//             code: convertRuleToYamlString(rule as any),
//           });
//         });
//         // });
//       }
//     });

//     const jsonContent = JSON.stringify(groups, null, 2);
//     fs.writeFileSync(ruleGroupsOutPath, jsonContent, "utf-8");
//   };

//   readFilesRecursively(rulesPathDir);
//   return { monitoringItems, groups };
// };

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
    groupName: group.name,
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

  // fs.writeFileSync(path.join(process.cwd(),"assets/groupss.json"), JSON.stringify(groups, null, 2));
  // fs.writeFileSync(path.join(process.cwd(),"assets/rulesBySlugg.json"), JSON.stringify(rulesBySlug, null, 2));

  const mergedData = mergeData(groups, rulesBySlug);
  fs.writeFileSync(path.join(process.cwd(),"assets/merged.json"), JSON.stringify(mergedData, null, 2));

  // console.log(JSON.stringify(mergedData, null, 2));
};
