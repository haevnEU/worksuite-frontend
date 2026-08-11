import React from "react";
import { Loader2 } from "lucide-react";

interface ConnectionRetrySectionProps {}

export const ConnectionRetrySection: React.FC<
  ConnectionRetrySectionProps
> = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-8">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
        <span>
          Automatic reconnect attempts are running in the background...
        </span>
      </div>
    </div>
  );
};
