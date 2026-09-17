import React from "react";
import { BookOpen, CheckSquare, Cpu, Rocket } from "lucide-react";

export const MrCreatorHelpTab: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          MR Description Guidelines
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Standardized criteria for fast and thorough code reviews.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-3.5 bg-[#0b111e] border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Context & Motivation</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            Reviewers rarely read the full Redmine ticket. Your summary must
            clearly state what bug was fixed or what business capability was
            introduced.
          </p>
        </div>

        <div className="p-3.5 bg-[#0b111e] border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Cpu className="w-4 h-4" />
            <span>Technical Details & Side Effects</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            List all modified modules, DTOs, or interfaces. Explicitly highlight
            breaking changes, altered database fields, or deprecated endpoints.
          </p>
        </div>

        <div className="p-3.5 bg-[#0b111e] border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckSquare className="w-4 h-4" />
            <span>Testability & Reproducibility</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            Provide step-by-step instructions with concrete expected outcomes.
            Mention specific payload or mock files attached to the ticket.
          </p>
        </div>

        <div className="p-3.5 bg-[#0b111e] border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Rocket className="w-4 h-4" />
            <span>CI/CD & Deployment Safety</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            Are Flyway migrations included? Do new environment variables need to
            be configured in GitLab CI or Helm charts? Keep operations safe.
          </p>
        </div>
      </div>
    </div>
  );
};
