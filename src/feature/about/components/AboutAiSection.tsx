import React, { useCallback, useEffect, useState } from "react";
import { Bot, CheckCircle2, Cpu, HardDrive, RefreshCw, XCircle } from "lucide-react";
import { ollamaMetaService } from "../services/ollamaMeta.service.ts";
import {useAiContext} from "../../ai-assistant";
import {OllamaMetaInfo} from "../model/ollamaMeta.model.ts";


export const AboutAiSection: React.FC = () => {
    const { config } = useAiContext();
    const [meta, setMeta] = useState<OllamaMetaInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loadTelemetry = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await ollamaMetaService.fetchFullTelemetry(config.model);
            setMeta(data);
        } finally {
            setIsLoading(false);
        }
    }, [config.model]);

    useEffect(() => {
        loadTelemetry();
    }, [loadTelemetry]);

    const formatBytes = (bytes: number): string => {
        if (!bytes || bytes === 0) return "0 MB";
        const gb = bytes / (1024 * 1024 * 1024);
        if (gb >= 1) return `${gb.toFixed(2)} GB`;
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(0)} MB`;
    };

    const isUp = meta?.status === "UP";
    const runningInstance = meta?.runningProcesses?.find((p) => p.name === config.model);

    return (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        Local LLM & Ollama Engine Telemetry
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={loadTelemetry}
                    disabled={isLoading}
                    className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer disabled:opacity-50"
                    title="Refresh Ollama telemetry"
                >
                    <RefreshCw
                        className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-400" : ""}`}
                    />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                {/* Runtime & Server Status */}
                <div className="p-4 bg-[#0b111e] rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Cpu className="w-4 h-4 text-purple-400" />
                            <span className="font-bold text-slate-200">
                Ollama Daemon Engine
              </span>
                        </div>
                        <span
                            className={`font-mono text-[11px] px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                                isUp
                                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                                    : "bg-rose-950/60 text-rose-400 border-rose-800/60"
                            }`}
                        >
              {isUp ? (
                  <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ONLINE</span>
                  </>
              ) : (
                  <>
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>OFFLINE</span>
                  </>
              )}
            </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-slate-400">
                            <span>Engine Version:</span>
                            <span className="font-mono text-slate-200">
                {meta?.version ? `v${meta.version}` : "—"}
              </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Reverse Proxy Base:</span>
                            <span className="font-mono text-purple-300">/api/ollama</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Configured Model:</span>
                            <span className="font-mono text-emerald-300 font-bold">
                {config.model || "—"}
              </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Model Architecture:</span>
                            <span className="font-mono text-slate-300">
                {meta?.activeModelDetails?.family
                    ? `${meta.activeModelDetails.family} (${meta.activeModelDetails.parameterSize || ""}, ${meta.activeModelDetails.quantizationLevel || ""})`
                    : "—"}
              </span>
                        </div>
                    </div>
                </div>

                {/* Memory & Process Telemetry */}
                <div className="p-4 bg-[#0b111e] rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <HardDrive className="w-4 h-4 text-blue-400" />
                            <span className="font-bold text-slate-200">Memory & Storage Pool</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {meta?.models?.length || 0} local weights
            </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-slate-400">
                            <span>Memory State (/api/ps):</span>
                            <span className="font-mono text-slate-300">
                {runningInstance
                    ? `Active in RAM (${formatBytes(runningInstance.sizeVram)} VRAM)`
                    : "Standby / Unloaded"}
              </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Hardware Offload:</span>
                            <span className="font-mono text-slate-300">
                ROCm / GTT Shared Memory (APU)
              </span>
                        </div>
                        <div className="flex justify-between text-slate-400 items-start pt-1">
                            <span>Local Models:</span>
                            <div className="flex flex-wrap gap-1 justify-end max-w-[280px]">
                                {meta && meta.models.length > 0 ? (
                                    meta.models.map((m) => (
                                        <span
                                            key={m.name}
                                            title={`Size: ${formatBytes(m.size)} | Quant: ${m.quantizationLevel || "N/A"}`}
                                            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                                                m.name === config.model
                                                    ? "bg-purple-950/70 border-purple-500/60 text-purple-300 font-bold"
                                                    : "bg-slate-900 border-slate-800 text-slate-400"
                                            }`}
                                        >
                      {m.name} ({formatBytes(m.size)})
                    </span>
                                    ))
                                ) : (
                                    <span className="font-mono text-slate-500">None detected</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};