import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorHeaderProps {
  status?: number;
  statusText?: string;
}

export const ErrorHeader: React.FC<ErrorHeaderProps> = ({
  status,
  statusText,
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white tracking-wide">
            {status
              ? `HTTP ${status} - ${statusText}`
              : "Application / Network Error"}
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          An unexpected error occurred during request processing on the
          backend/gateway.
        </p>
      </div>
    </div>
  );
};
