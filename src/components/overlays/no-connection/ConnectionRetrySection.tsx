import React from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface ConnectionRetrySectionProps {
  isRetrying: boolean;
  onRetry: () => void;
}

export const ConnectionRetrySection: React.FC<ConnectionRetrySectionProps> = ({
  isRetrying,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed mb-4"
      >
        <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
        <span>{isRetrying ? "Checking Connection..." : "Try Again"}</span>
      </button>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-8">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
        <span>
          Automatic reconnect attempts are running in the background...
        </span>
      </div>
    </div>
  );
};
