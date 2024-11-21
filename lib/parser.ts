"use server";

import path from "path";
import fs from "fs";
import jsYaml from "js-yaml";
import type { RuleYML } from "@/types";

export const readAlertRulesFromFS = async () => {
  const monitoringItems: {
    title: any;
    description: any;
    icon?: JSX.Element;
    alerts: number;
  }[] = [];

  let groups: RuleYML['groups'] = [];

  const rulesPathDir = path.join(process.cwd(), "/assets/rules");
  const ruleGroupsOutPath = path.join(process.cwd(), "/assets", "groups.json");

  const readFilesRecursively = (directory: string) => {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      if (fs.statSync(fullPath).isDirectory()) {
        readFilesRecursively(fullPath);
      } else if (file.endsWith(".yml") || file.endsWith(".yaml")) {
        const yamlContent = fs.readFileSync(fullPath, "utf8");
        const jsonData = jsYaml.load(yamlContent, { json: true }) as RuleYML;
        groups = [...groups, ...jsonData?.groups];

        // jsonData.groups.forEach((group) => {
          jsonData?.groups?.[0]?.rules?.forEach((rule) => {
            monitoringItems.push({
              title: rule.annotations.summary,
              description: rule.annotations.description,
            //   icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
              alerts: 1, // You can customize this based on your data
            });
          });
        // });
      }
    });

    const jsonContent = JSON.stringify(groups, null, 2);
    fs.writeFileSync(ruleGroupsOutPath, jsonContent, 'utf-8');
  };

  readFilesRecursively(rulesPathDir);
  return monitoringItems;
};
