import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ErrorPayloadViewerProps {
  responseBody?: string;
  showRawHtml: boolean;
  onToggle: () => void;
}

export const ErrorPayloadViewer: React.FC<ErrorPayloadViewerProps> = ({
  responseBody,
  showRawHtml,
  onToggle,
}) => {
  if (!responseBody) return null;

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-400 transition cursor-pointer"
      >
        <span>
          {showRawHtml ? "Hide details" : "Show server response payload"}
        </span>
        {showRawHtml ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {showRawHtml && (
        <pre className="mt-2 max-h-40 overflow-y-auto bg-black/50 p-3 rounded-lg text-[11px] font-mono text-slate-400 border border-slate-800 whitespace-pre-wrap">
          {responseBody}
        </pre>
      )}
    </div>
  );
};
