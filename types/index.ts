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

export interface RuleDetailsProps {
  id: number;
  title: string;
  description: string;
  code: string;
}

export interface Exporter {
  name: string;
  slug: string;
  rules: Rule[];
}

export interface Service {
  name: string;
  exporters: Exporter[];
}

export interface Group {
  name: string;
  services: Service[];
}

export interface Rule {
  name: string;
  description: string;
  query: string;
  severity: string;
  for?: string;
  alert?: string;
  expr?: string;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
}