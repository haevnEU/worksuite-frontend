import React from "react";
import { RefreshCw } from "lucide-react";

interface ErrorActionsProps {
  onDismiss: () => void;
  onReload: () => void;
}

export const ErrorActions: React.FC<ErrorActionsProps> = ({
  onDismiss,
  onReload,
}) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
      <button
        type="button"
        onClick={onDismiss}
        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
      >
        Dismiss
      </button>
      <button
        type="button"
        onClick={onReload}
        className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reload Page</span>
      </button>
    </div>
  );
};
