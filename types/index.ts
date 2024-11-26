export interface Exporter {
  name?: string;
  slug?: string;
  rules?: Rule[];
}

export interface Service {
  icon?: any;
  name?: string;
  description?: string;
  totalRules?: number;
  exporters?: Exporter[];
}

export interface Group {
  groupName: string;
  services: Service[];
}

export interface Rule {
  name?: string;
  description?: string;
  query?: string;
  severity?: string;
  for?: string;
  alert?: string;
  expr?: string;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
}
