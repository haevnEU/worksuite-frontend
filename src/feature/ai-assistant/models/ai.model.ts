export type AiProviderType = "ollama" | "openai-compatible";

export interface LocalAiConfig {
  enabled: boolean;
  baseUrl: string;
  model: string;
  provider: AiProviderType;
  temperature: number;
  systemPrompt: string;
}

export interface PromptOptions {
  systemPrompt?: string;
  temperature?: number;
  onChunk?: (chunk: string) => void;
  signal?: AbortSignal;
}

export interface AvailableModel {
  name: string;
  size?: number;
  modifiedAt?: string;
}
