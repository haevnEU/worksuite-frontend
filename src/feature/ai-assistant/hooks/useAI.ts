import { useCallback, useRef, useState } from "react";
import { useAiContext } from "../context/AiContext";
import { executePromptStream } from "../services/localllm.service";
import type { PromptOptions } from "../models/ai.model";

export function useAI() {
  const { config, isConnected } = useAiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");

  const abortControllerRef = useRef<AbortController | null>(null);

  const isReady = Boolean(config.enabled && isConnected);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const generate = useCallback(
    async (prompt: string, options?: PromptOptions): Promise<string> => {
      if (!config.enabled) {
        const msg = "Lokale KI ist in den Einstellungen deaktiviert.";
        setError(msg);
        throw new Error(msg);
      }

      if (!isConnected) {
        const msg = "Lokale KI-Schnittstelle ist aktuell nicht erreichbar.";
        setError(msg);
        throw new Error(msg);
      }

      setIsLoading(true);
      setError(null);
      setOutput("");

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const result = await executePromptStream(prompt, config, {
          ...options,
          signal: options?.signal ?? controller.signal,
          onChunk: (chunk) => {
            setOutput((prev) => prev + chunk);
            if (options?.onChunk) options.onChunk(chunk);
          },
        });
        return result;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return "";
        }
        const msg = err instanceof Error ? err.message : "Inferenzfehler";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [config, isConnected],
  );

  return {
    generate,
    abort,
    output,
    setOutput,
    isLoading,
    error,
    isReady,
    isEnabled: config.enabled,
    currentModel: config.model,
  };
}
