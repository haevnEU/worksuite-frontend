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
}
