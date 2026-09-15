import React, {createContext, useCallback, useContext, useEffect, useRef, useState,} from "react";
import type {AvailableModel, LocalAiConfig} from "../models/ai.model";
import {fetchInstalledModels, testAiConnection,} from "../services/localllm.service";

const STORAGE_KEY_CONFIG = "worktool_local_ai_config";

export const DEFAULT_AI_CONFIG: LocalAiConfig = {
  enabled: true,
  baseUrl: "/api/ollama",
  model: "llama3.2:3b",
  assistantName: "WorkSuite AI",
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
          ? {...DEFAULT_AI_CONFIG, ...JSON.parse(raw)}
          : DEFAULT_AI_CONFIG;
    } catch {
      return DEFAULT_AI_CONFIG;
    }
  });

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Ref, um in Callbacks immer die aktuellste Config ohne unnötige Re-Renders zu haben
  const configRef = useRef(config);
  configRef.current = config;

  const updateConfig = useCallback((patch: Partial<LocalAiConfig>) => {
    setConfig((prev) => {
      const next = {...prev, ...patch};
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(next));
      return next;
    });
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    const currentConfig = configRef.current;
    const ok = await testAiConnection(currentConfig);
    setIsConnected(ok);

    if (!ok && currentConfig.enabled) {
      updateConfig({enabled: false});
    }

    return ok;
  }, [updateConfig]);

  const refreshModels = useCallback(async () => {
    setIsLoadingModels(true);
    const currentConfig = configRef.current;
    try {
      const models = await fetchInstalledModels(currentConfig);
      setAvailableModels(models);

      const connectionOk =
          models.length > 0 || (await testAiConnection(currentConfig));
      setIsConnected(connectionOk);

      if (models.length > 0) {
        // Falls das ausgewählte Modell nicht auf dem Host existiert,
        // automatisch auf das erste verfügbare Modell wechseln
        const exists = models.some((m) => m.name === currentConfig.model);
        if (!exists) {
          updateConfig({model: models[0].name});
        }
      }

      if (!connectionOk && currentConfig.enabled) {
        updateConfig({enabled: false});
      }
    } finally {
      setIsLoadingModels(false);
    }
  }, [updateConfig]);

  const toggleEnabled = useCallback(
      async (forceState?: boolean): Promise<boolean> => {
        const currentConfig = configRef.current;
        const targetState = forceState ?? !currentConfig.enabled;

        if (!targetState) {
          updateConfig({enabled: false});
          return false;
        }

        const ok = await checkConnection();
        if (ok) {
          updateConfig({enabled: true});
          return true;
        }

        updateConfig({enabled: false});
        return false;
      },
      [checkConnection, updateConfig],
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