import React from "react";
import { Check, Code2, Copy, Loader2 } from "lucide-react";

interface XmlPreviewCardProps {
  xmlContent: string;
  isGenerating: boolean;
  onCopy: () => void;
  copied: boolean;
}

export const XmlPreviewCard: React.FC<XmlPreviewCardProps> = ({
  xmlContent,
  isGenerating,
  onCopy,
  copied,
}) => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Backend XML Output (/api/v1/validation)
          </h2>
        </div>

        {xmlContent && !isGenerating && (
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-sans cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied to clipboard" : "Copy"}</span>
          </button>
        )}
      </div>

      {isGenerating ? (
        <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <span>Generating XML schema from backend...</span>
        </div>
      ) : xmlContent ? (
        <pre className="p-4 rounded-xl bg-[#070c18] border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto select-all scrollbar-thin scrollbar-thumb-slate-800">
          {xmlContent}
        </pre>
      ) : (
        <div className="p-8 text-center text-slate-500 text-xs italic font-sans border border-dashed border-slate-800 rounded-xl bg-[#0b111e]">
          Configure your rules and click <strong>Generate XML</strong> to fetch
          the validation file from the backend service.
        </div>
      )}
    </div>
  );
};
