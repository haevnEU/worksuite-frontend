import React, { useState } from "react";
import {
  X,
  BookOpen,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Code2,
} from "lucide-react";
import { getCategoryBadgeStyle } from "./HttpStatusCard.tsx";
import {
  getResteasyExceptionSnippet,
  getSpringExceptionSnippet,
} from "../../../utils/http.util.ts";
import { HttpStatusCode } from "../../../models/network.model.ts";

interface HttpStatusDrawerProps {
  item: HttpStatusCode | null;
  onClose: () => void;
}

export const HttpStatusDrawer: React.FC<HttpStatusDrawerProps> = ({
  item,
  onClose,
}) => {
  const [copiedSpring, setCopiedSpring] = useState(false);
  const [copiedResteasy, setCopiedResteasy] = useState(false);

  if (!item) return null;

  const springSnippet = getSpringExceptionSnippet(item.code, item.phrase);
  const resteasySnippet = getResteasyExceptionSnippet(item.code, item.phrase);

  const handleCopySpring = () => {
    navigator.clipboard.writeText(springSnippet);
    setCopiedSpring(true);
    setTimeout(() => setCopiedSpring(false), 1500);
  };

  const handleCopyResteasy = () => {
    navigator.clipboard.writeText(resteasySnippet);
    setCopiedResteasy(true);
    setTimeout(() => setCopiedResteasy(false), 1500);
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 xl:hidden animate-in fade-in duration-200"
      />

      <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-6 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black font-mono text-white tracking-tight">
                {item.code}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border ${getCategoryBadgeStyle(
                  item.category,
                )}`}
              >
                {item.category}
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-200">{item.phrase}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Specification */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Specification</span>
            </div>
            <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
              {item.description}
            </p>
            <span className="text-[10px] text-slate-500 block font-mono pl-1">
              Standard: {item.rfc}
            </span>
          </section>

          {/* Practical Example */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Practical Example</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 leading-relaxed break-words">
              {item.practicalExample}
            </div>
          </section>

          {/* Client Behavior */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Client & UI Behavior</span>
            </div>
            <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
              {item.clientBehavior}
            </p>
          </section>
        </div>

        {/* Quick Snippet Actions */}
        <div className="pt-4 border-t border-slate-800 shrink-0 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Copy Java Snippet</span>
          </div>

          {/* Spring Boot */}
          <button
            type="button"
            onClick={handleCopySpring}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-between group"
          >
            <span className="truncate font-mono text-[11px] text-slate-300">
              Spring{" "}
              <span className="text-slate-500 font-sans">
                ResponseStatusException
              </span>
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {copiedSpring ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Copied
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              )}
            </div>
          </button>

          {/* Jakarta REST / RESTEasy */}
          <button
            type="button"
            onClick={handleCopyResteasy}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-between group"
          >
            <span className="truncate font-mono text-[11px] text-slate-300">
              RESTEasy{" "}
              <span className="text-slate-500 font-sans">
                Jakarta Exception
              </span>
            </span>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {copiedResteasy ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <Check className="w-3.5 h-3.5" /> Copied
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              )}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
