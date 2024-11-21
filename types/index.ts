export interface RuleYML {
  groups: {
    name: string;
    rules: {
      alert: string;
      expr: string;
      for: string;
      labels: { severity: "critical" | string };
      annotations: {
        summary: string;
        description: string;
      };
    }[];
  }[];
}
