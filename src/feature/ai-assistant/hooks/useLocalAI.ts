import { useAiContext } from "../context/AiContext";

export function useLocalAI() {
  const {
    config,
    updateConfig,
    toggleEnabled,
    resetConfig,
    isConnected,
    checkConnection,
    availableModels,
    refreshModels,
    isLoadingModels,
  } = useAiContext();

  return {
    isEnabled: config.enabled,
    config,
    updateConfig,
    toggleEnabled,
    resetConfig,
    isConnected,
    checkConnection,
    availableModels,
    refreshModels,
    isLoadingModels,
  };
}
