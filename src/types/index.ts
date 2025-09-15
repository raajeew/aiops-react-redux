export interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  health: number;
  responseTime: number;
  uptime: number;
  lastUpdated: string;
  description: string;
  version: string;
  environment: 'production' | 'staging' | 'development';
}

export interface Situation {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created: string;
  updated: string;
  assignee?: string;
  tags: string[];
  affectedServices: string[];
}

export interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

export interface MetricData {
  timestamp: string;
  value: number;
  label: string;
}

export interface OverviewStats {
  totalServices: number;
  healthyServices: number;
  warningServices: number;
  criticalServices: number;
  openSituations: number;
  resolvedSituations: number;
  avgResponseTime: number;
  systemUptime: number;
}

export interface Configuration {
  id: string;
  category: 'monitoring' | 'alerting' | 'notifications' | 'thresholds';
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[];
  editable: boolean;
}
