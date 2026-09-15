import { NetworkService } from "../../../services/network/network.service.ts";
import {
    OllamaMetaInfo,
    OllamaModelTag,
    OllamaRunningProcess,
} from "../model/ollamaMeta.model.ts";

export class OllamaMetaService extends NetworkService {
    private readonly ollamaBase = "/api/ollama";

    constructor() {
        super("/ollama");
    }

    private async getOllama<T>(path: string): Promise<T> {
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const res = await fetch(`${this.ollamaBase}${cleanPath}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            throw new Error(`Ollama request failed: ${res.statusText}`);
        }
        return res.json();
    }

    private async postOllama<T>(path: string, body: unknown): Promise<T> {
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const res = await fetch(`${this.ollamaBase}${cleanPath}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new Error(`Ollama request failed: ${res.statusText}`);
        }
        return res.json();
    }

    public async fetchVersion(): Promise<string> {
        try {
            const data = await this.getOllama<{ version: string }>("/api/version");
            return data.version || "unknown";
        } catch {
            return "offline";
        }
    }

    public async fetchInstalledTags(): Promise<OllamaModelTag[]> {
        try {
            const data = await this.getOllama<{
                models: Array<{
                    name: string;
                    size: number;
                    modified_at?: string;
                    digest?: string;
                    details?: {
                        parameter_size?: string;
                        quantization_level?: string;
                        family?: string;
                    };
                }>;
            }>("/api/tags");

            return (data.models || []).map((m) => ({
                name: m.name,
                size: m.size,
                modifiedAt: m.modified_at,
                digest: m.digest,
                parameterSize: m.details?.parameter_size,
                quantizationLevel: m.details?.quantization_level,
                family: m.details?.family,
            }));
        } catch {
            return [];
        }
    }

    public async fetchRunningProcesses(): Promise<OllamaRunningProcess[]> {
        try {
            const data = await this.getOllama<{
                models: Array<{
                    name: string;
                    size: number;
                    size_vram: number;
                    expires_at: string;
                }>;
            }>("/api/ps");

            return (data.models || []).map((m) => ({
                name: m.name,
                size: m.size,
                sizeVram: m.size_vram,
                expiresAt: m.expires_at,
            }));
        } catch {
            return [];
        }
    }

    public async fetchModelDetails(modelName: string) {
        if (!modelName) return undefined;
        try {
            const data = await this.postOllama<{
                details?: {
                    family?: string;
                    parameter_size?: string;
                    quantization_level?: string;
                    format?: string;
                };
            }>("/api/show", { model: modelName });
            return data.details;
        } catch {
            return undefined;
        }
    }

    public async fetchFullTelemetry(activeModelName?: string): Promise<OllamaMetaInfo> {
        const version = await this.fetchVersion();
        const isUp = version !== "offline";

        if (!isUp) {
            return {
                version: "Offline",
                status: "DOWN",
                models: [],
                runningProcesses: [],
            };
        }

        const [models, runningProcesses, activeModelDetails] = await Promise.all([
            this.fetchInstalledTags(),
            this.fetchRunningProcesses(),
            activeModelName ? this.fetchModelDetails(activeModelName) : Promise.resolve(undefined),
        ]);

        return {
            version,
            status: "UP",
            models,
            runningProcesses,
            activeModelDetails: activeModelDetails
                ? {
                    family: activeModelDetails.family,
                    parameterSize: activeModelDetails.parameter_size,
                    quantizationLevel: activeModelDetails.quantization_level,
                    format: activeModelDetails.format,
                }
                : undefined,
        };
    }
}

export const ollamaMetaService = new OllamaMetaService();