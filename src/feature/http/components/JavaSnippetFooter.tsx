import React, { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import {
  getResteasyExceptionSnippet,
  getSpringExceptionSnippet,
} from "../utils/http.util.ts";

interface JavaSnippetFooterProps {
  code: number;
  phrase: string;
}

export const JavaSnippetFooter: React.FC<JavaSnippetFooterProps> = ({
  code,
  phrase,
}) => {
  const [copiedSpring, setCopiedSpring] = useState(false);
  const [copiedResteasy, setCopiedResteasy] = useState(false);

  const springSnippet = getSpringExceptionSnippet(code, phrase);
  const resteasySnippet = getResteasyExceptionSnippet(code, phrase);

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
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">
        <Code2 className="w-3.5 h-3.5 text-purple-400" />
        <span>Copy Java Snippet</span>
      </div>

      {/* Spring Boot ResponseStatusException */}
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

      {/* RESTEasy / Jakarta REST WebApplicationException */}
      <button
        type="button"
        onClick={handleCopyResteasy}
        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-between group"
      >
        <span className="truncate font-mono text-[11px] text-slate-300">
          RESTEasy{" "}
          <span className="text-slate-500 font-sans">Jakarta Exception</span>
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
  );
};
