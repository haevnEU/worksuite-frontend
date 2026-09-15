export interface OllamaModelTag {
    name: string;
    size: number;
    modifiedAt?: string;
    digest?: string;
    parameterSize?: string;
    quantizationLevel?: string;
    family?: string;
}

export interface OllamaRunningProcess {
    name: string;
    size: number;
    sizeVram: number;
    expiresAt: string;
}

export interface OllamaMetaInfo {
    version: string;
    status: "UP" | "DOWN";
    models: OllamaModelTag[];
    runningProcesses: OllamaRunningProcess[];
    activeModelDetails?: {
        family?: string;
        parameterSize?: string;
        quantizationLevel?: string;
        format?: string;
    };
}