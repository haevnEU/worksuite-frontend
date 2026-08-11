import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ProtectedBranchPipeline } from "../../models/vcs.model.ts";

interface PipelineMonitorWidgetProps {
  pipelines: ProtectedBranchPipeline[];
}

export const PipelineMonitorWidget: React.FC<PipelineMonitorWidgetProps> = ({
  pipelines,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center space-x-2 text-xs font-bold text-white border-b border-slate-800 pb-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Protected Branch Pipelines</span>
      </div>

      <div className="space-y-2">
        {pipelines.map((p) => {
          const isSuccess = p.status === "success";
          const isFailed = p.status === "failed";

          return (
            <div
              key={p.id}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5 min-w-0 pr-2">
                <div className="flex items-center space-x-2 font-bold text-slate-300">
                  <span className="truncate">{p.projectName}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-indigo-300 font-mono">
                    {p.branchName}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {p.commitMessage}
                </div>
              </div>

              <a
                href={p.webUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center space-x-1"
              >
                {isSuccess && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {isFailed && <XCircle className="w-4 h-4 text-rose-400" />}
                {!isSuccess && !isFailed && (
                  <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                )}
                <ExternalLink className="w-3 h-3 text-slate-600 hover:text-slate-300 transition-colors" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
