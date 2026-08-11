import React, { useState } from "react";
import {
  GitBranch,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { MergeRequestModel } from "../../models/vcs.model.ts";
import { PipelineStatus } from "../../types/vcs.type.ts";

interface MergeRequestCardProps {
  mr: MergeRequestModel;
}

export const MergeRequestCard: React.FC<MergeRequestCardProps> = ({ mr }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyBranch = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(`git checkout ${mr.sourceBranch}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPipelineBadge = (status: PipelineStatus) => {
    switch (status) {
      case "success":
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Passed</span>
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      case "running":
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3 animate-spin" />
            <span>Running</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
            <span className="text-orange-400">{mr.projectName}</span>
            <span>•</span>
            <span>#{mr.iid}</span>
          </div>

          <a
            href={mr.webUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-white hover:text-indigo-400 transition-colors flex items-center space-x-1.5 truncate"
          >
            <span className="truncate">{mr.title}</span>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          {mr.isDraft && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
              Draft
            </span>
          )}
          {mr.hasConflicts && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              <span>Conflict</span>
            </span>
          )}
          {renderPipelineBadge(mr.pipelineStatus)}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          {/* Author */}
          <div className="flex items-center space-x-1.5">
            {mr.author.avatarUrl ? (
              <img
                src={mr.author.avatarUrl}
                alt={mr.author.name}
                className="w-4 h-4 rounded-full"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-800 text-[9px] font-bold flex items-center justify-center text-slate-300">
                {mr.author.name[0]}
              </div>
            )}
            <span>{mr.author.name}</span>
          </div>

          {/* Comments count */}
          {mr.userNotesCount > 0 && (
            <div className="flex items-center space-x-1 text-slate-400">
              <MessageSquare className="w-3 h-3" />
              <span>{mr.userNotesCount}</span>
            </div>
          )}
        </div>

        {/* Branch Checkout Copy Button */}
        <button
          type="button"
          onClick={handleCopyBranch}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors font-mono text-[10px] cursor-pointer"
          title={`Copy: git checkout ${mr.sourceBranch}`}
        >
          <GitBranch className="w-3 h-3 text-indigo-400" />
          <span className="max-w-[120px] truncate">{mr.sourceBranch}</span>
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400 ml-1" />
          ) : (
            <Copy className="w-3 h-3 text-slate-500 ml-1" />
          )}
        </button>
      </div>
    </div>
  );
};
