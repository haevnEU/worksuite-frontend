export interface DatabaseInfo {
  databaseProductName: string;
  databaseProductVersion: string;
  driverName: string;
  url: string;
  status: "UP" | "DOWN";
  pingMs: number;
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
}

export interface AboutSystemInfo {
  appName: string;
  version: string;
  gitCommit: string;
  environment: string;
  buildTimestamp: string;
  serverTime: string;
  javaVersion: string;
  springBootVersion: string;
  osName: string;
  osArch: string;
  uptimeSeconds: number;
  serviceHealth: Record<string, string>;
  postgresInfo?: DatabaseInfo;
  mongoInfo?: DatabaseInfo;
}
