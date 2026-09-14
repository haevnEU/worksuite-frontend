import React, { useState } from "react";
import {
  AlertTriangle,
  Bot,
  Loader2,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useAI } from "../hooks/useAI.ts";
import { CopyButton } from "../../../shared/components/CopyButton.tsx";
import { Drawer } from "../../../shared/components/Drawer.tsx";
import { MarkdownRenderer } from "../../../shared/components/MarkdownRenderer.tsx";

export interface AiOverlayDrawerProps {
  buttonLabel?: string;
  buttonBadge?: string | number;
  isDisabled?: boolean;

  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  widthClass?: string;

  loadingTitle?: string;
  loadingSubtitle?: string;
  emptyMessage?: string;

  getPrompt: () => string;
  systemPrompt?: string;
  temperature?: number;

  children?: React.ReactNode;
  onSuccess?: (output: string) => void;
}

export const AiOverlayDrawer: React.FC<AiOverlayDrawerProps> = ({
  buttonLabel,
  buttonBadge,
  isDisabled = false,
  title,
  subtitle,
  icon = <Bot className="w-4 h-4" />,
  widthClass = "max-w-2xl sm:w-[640px]",
  loadingTitle,
  loadingSubtitle = "Processing context through local model.",
  emptyMessage = "No data available to analyze.",
  getPrompt,
  systemPrompt,
  temperature = 0.2,
  children,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    generate,
    abort,
    output,
    isLoading,
    error,
    isReady,
    currentModel,
    assistantName,
  } = useAI();

  if (!isReady) return null;

  const resolvedButtonLabel = buttonLabel || `Ask ${assistantName}`;
  const resolvedLoadingTitle =
    loadingTitle || `${assistantName} is analyzing...`;

  const runAnalysis = async () => {
    if (isDisabled) return;
    const prompt = getPrompt();
    if (!prompt.trim()) return;

    try {
      const res = await generate(prompt, { systemPrompt, temperature });
      onSuccess?.(res);
    } catch {}
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!output && !isDisabled) {
      runAnalysis();
    }
  };

  const handleClose = () => {
    abort();
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={handleOpen}
          disabled={isDisabled}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xl shadow-purple-600/30 border border-purple-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title={`Run analysis with ${currentModel}`}
        >
          <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
          <span>{resolvedButtonLabel}</span>
          {buttonBadge !== undefined && (
            <span className="px-1.5 py-0.5 rounded-md bg-purple-800/80 text-[10px] font-mono text-purple-200">
              {buttonBadge}
            </span>
          )}
        </button>
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={handleClose}
        widthClass={widthClass}
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">
                Model:{" "}
                <span className="text-purple-300 font-mono">
                  {currentModel}
                </span>
              </p>
            </div>
          </div>
        }
        subtitle={
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 bg-[#10192c] px-3 py-1.5 rounded-xl border border-slate-800">
            <div>{subtitle}</div>
            <div className="flex items-center gap-2">
              {output && (
                <CopyButton
                  textToCopy={output}
                  title="Copy analysis"
                  className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 cursor-pointer"
                />
              )}
              <button
                type="button"
                onClick={runAnalysis}
                disabled={isLoading || isDisabled}
                className="p-1 hover:text-white transition cursor-pointer text-slate-400 disabled:opacity-40"
                title="Re-run analysis"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col min-h-full justify-between space-y-4 font-sans text-xs text-slate-200">
          <div className="space-y-4">
            {isLoading && !output && (
              <div className="py-16 text-center space-y-3">
                <Loader2 className="w-7 h-7 animate-spin mx-auto text-purple-400" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    {resolvedLoadingTitle}
                  </p>
                  <p className="text-xs text-slate-400">{loadingSubtitle}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-bold">Analysis failed</p>
                  <p className="text-[11px] text-rose-200/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {output && (
              <div className="p-5 bg-[#0b111e] border border-slate-800 rounded-xl leading-relaxed whitespace-pre-wrap font-sans text-slate-200 shadow-inner">
                <MarkdownRenderer content={output} />
              </div>
            )}

            {isDisabled && !isLoading && (
              <div className="p-8 text-center text-slate-500 italic">
                {emptyMessage}
              </div>
            )}

            {children}
          </div>

          {/* Verification Disclaimer Footer */}
          <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
              <span>
                {assistantName} responses can contain hallucinations. Always
                verify generated code and schema fixes.
              </span>
            </span>
            <span className="font-mono text-[10px] text-slate-600 hidden sm:inline-block">
              {currentModel}
            </span>
          </div>
        </div>
      </Drawer>
    </>
  );
};
