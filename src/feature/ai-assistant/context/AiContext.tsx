import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AvailableModel, LocalAiConfig } from "../models/ai.model";
import {
  fetchInstalledModels,
  testAiConnection,
} from "../services/localllm.service";

const STORAGE_KEY_CONFIG = "worktool_local_ai_config";

export const DEFAULT_AI_CONFIG: LocalAiConfig = {
  enabled: true,
  baseUrl: "http://localhost:11434",
  model: "llama3:8b",
  provider: "ollama",
  temperature: 0.2,
  systemPrompt:
    "You are a Senior Software Engineer specializing in clean code, maintainability, testability, and security across Java and TypeScript environments.",
};

interface AiContextType {
  config: LocalAiConfig;
  updateConfig: (patch: Partial<LocalAiConfig>) => void;
  toggleEnabled: (forceState?: boolean) => Promise<boolean>;
  resetConfig: () => void;
  isConnected: boolean | null;
  checkConnection: () => Promise<boolean>;
  availableModels: AvailableModel[];
  refreshModels: () => Promise<void>;
  isLoadingModels: boolean;
}

const AiContext = createContext<AiContextType | null>(null);

export const AiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<LocalAiConfig>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      return raw
        ? { ...DEFAULT_AI_CONFIG, ...JSON.parse(raw) }
        : DEFAULT_AI_CONFIG;
    } catch {
      return DEFAULT_AI_CONFIG;
    }
  });

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    const ok = await testAiConnection(config);
    setIsConnected(ok);

    if (!ok && config.enabled) {
      setConfig((prev) => {
        const updated = { ...prev, enabled: false };
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
        return updated;
      });
    }

    return ok;
  }, [config]);

  const refreshModels = useCallback(async () => {
    setIsLoadingModels(true);
    try {
      const models = await fetchInstalledModels(config);
      setAvailableModels(models);
      const connectionOk =
        models.length > 0 || (await testAiConnection(config));
      setIsConnected(connectionOk);

      if (!connectionOk && config.enabled) {
        setConfig((prev) => {
          const updated = { ...prev, enabled: false };
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
          return updated;
        });
      }
    } finally {
      setIsLoadingModels(false);
    }
  }, [config]);

  const updateConfig = useCallback(
    (patch: Partial<LocalAiConfig>) => {
      setConfig((prev) => {
        const nextEnabled =
          patch.enabled !== undefined
            ? patch.enabled && isConnected === true
            : prev.enabled;

        const next = { ...prev, ...patch, enabled: nextEnabled };
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(next));
        return next;
      });
    },
    [isConnected],
  );

  const toggleEnabled = useCallback(
    async (forceState?: boolean): Promise<boolean> => {
      const targetState = forceState ?? !config.enabled;

      if (!targetState) {
        updateConfig({ enabled: false });
        return false;
      }

      const ok = await checkConnection();
      if (ok) {
        updateConfig({ enabled: true });
        return true;
      }

      updateConfig({ enabled: false });
      return false;
    },
    [config.enabled, checkConnection, updateConfig],
  );

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_AI_CONFIG);
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(DEFAULT_AI_CONFIG));
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return (
    <AiContext.Provider
      value={{
        config,
        updateConfig,
        toggleEnabled,
        resetConfig,
        isConnected,
        checkConnection,
        availableModels,
        refreshModels,
        isLoadingModels,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};

export const useAiContext = () => {
  const ctx = useContext(AiContext);
  if (!ctx) {
    throw new Error("useAiContext must be used within an <AiProvider>.");
  }
  return ctx;
};
