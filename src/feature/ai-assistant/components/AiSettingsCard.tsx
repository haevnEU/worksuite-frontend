import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Power,
  RefreshCw,
  Server,
  Sliders,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useLocalAI } from "../hooks/useLocalAI";

export const AiSettingsCard: React.FC = () => {
  const {
    config,
    isEnabled,
    updateConfig,
    toggleEnabled,
    resetConfig,
    isConnected,
    checkConnection,
    availableModels,
    refreshModels,
    isLoadingModels,
  } = useLocalAI();

  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await toggleEnabled();
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
              isEnabled && isConnected
                ? "bg-purple-600/20 border-purple-500/40 text-purple-400"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Local AI Integration
              </h2>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                  isEnabled
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {isEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ollama or OpenAI-compatible local endpoints (LocalAI, vLLM)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1.5 ${
              isConnected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : isConnected === false
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Connected
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" /> Offline
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => {
              checkConnection();
              refreshModels();
            }}
            disabled={isLoadingModels}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer disabled:opacity-40"
            title="Check connection again"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingModels ? "animate-spin" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={handleToggle}
            disabled={(!isConnected && !isEnabled) || isToggling}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              isEnabled
                ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-600/20"
                : isConnected
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                  : "bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed"
            }`}
            title={
              !isConnected && !isEnabled
                ? "Activation requires an active connection"
                : isEnabled
                  ? "Disable feature"
                  : "Enable feature"
            }
          >
            <Power
              className={`w-3.5 h-3.5 ${isToggling ? "animate-spin" : ""}`}
            />
            <span>{isEnabled ? "Active" : "Enable"}</span>
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl flex items-center gap-2.5 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            No connection to local AI instance. This feature can only be enabled
            once the endpoint is reachable.
          </span>
        </div>
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${!isEnabled ? "opacity-75" : "opacity-100"}`}
      >
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            API Base URL
          </label>
          <input
            type="text"
            value={config.baseUrl}
            onChange={(e) => updateConfig({ baseUrl: e.target.value })}
            placeholder="http://localhost:11434"
            className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              Active Model
            </span>
            {availableModels.length > 0 && (
              <span className="text-[10px] text-slate-500 font-mono">
                {availableModels.length} locally available
              </span>
            )}
          </label>

          {availableModels.length > 0 ? (
            <select
              value={config.model}
              onChange={(e) => updateConfig({ model: e.target.value })}
              className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {availableModels.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={config.model}
              onChange={(e) => updateConfig({ model: e.target.value })}
              placeholder="e.g. llama3:8b, qwen2.5-coder:7b"
              className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400">
            Protocol / Engine
          </label>
          <select
            value={config.provider}
            onChange={(e) => updateConfig({ provider: e.target.value as any })}
            className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ollama">Ollama (/api/generate)</option>
            <option value="openai-compatible">
              OpenAI-compatible (/v1/chat/completions)
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Temperature (Creativity vs. Precision)
            </label>
            <span className="text-xs font-mono text-purple-400 font-bold">
              {config.temperature}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.temperature}
            onChange={(e) =>
              updateConfig({ temperature: parseFloat(e.target.value) })
            }
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
        <label className="text-[11px] font-semibold text-slate-400">
          Global Default System Prompt
        </label>
        <textarea
          rows={3}
          value={config.systemPrompt}
          onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
          className="w-full bg-[#0b111e] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed font-mono resize-y"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={resetConfig}
          className="px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
