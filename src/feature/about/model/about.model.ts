export interface DatabaseInfo {
    databaseProductName?: string;
    databaseProductVersion?: string;
    status: "UP" | "DOWN" | "UNKNOWN" | string;
    pingMs?: number;
    url?: string;
    driverName?: string;
    activeConnections?: number;
    idleConnections?: number;
    totalConnections?: number;
}

export interface AboutSystemInfo {
    version: string;
    gitCommit: string;
    buildTimestamp: string;
    environment: string;
    uptimeSeconds: number;
    springBootVersion?: string;
    javaVersion?: string;
    osName?: string;
    osArch?: string;
    postgresInfo?: DatabaseInfo;
    mongoInfo?: DatabaseInfo;
}