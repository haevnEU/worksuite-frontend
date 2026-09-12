import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Layers,
  Terminal,
  XCircle,
} from "lucide-react";
import type { HttpMethodDetail } from "../models/http.model";
import {
  generateCurlSnippet,
  generateFetchSnippet,
  generateJavaSnippet,
  getMethodBadgeColor,
} from "../utils/http.util";
import { Drawer } from "../../../shared/components/Drawer.tsx";
import { CopyButton } from "../../../shared/components/CopyButton.tsx";

interface HttpMethodDrawerProps {
  item: HttpMethodDetail | null;
  onClose: () => void;
}

export const HttpMethodDrawer: React.FC<HttpMethodDrawerProps> = React.memo(
  ({ item, onClose }) => {
    const [activeTab, setActiveTab] = useState<"CURL" | "FETCH" | "JAVA">(
      "CURL",
    );

    const activeSnippet = useMemo(() => {
      if (!item) return "";
      switch (activeTab) {
        case "CURL":
          return generateCurlSnippet(item);
        case "FETCH":
          return generateFetchSnippet(item);
        case "JAVA":
          return generateJavaSnippet(item);
      }
    }, [item, activeTab]);

    if (!item) return null;

    return (
      <Drawer
        isOpen={Boolean(item)}
        onClose={onClose}
        widthClass="sm:w-[480px]"
        title={
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-3 py-1 text-sm font-black font-mono tracking-wider rounded-lg border ${getMethodBadgeColor(
                item.method,
              )}`}
            >
              {item.method}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border border-slate-700 bg-slate-800 text-slate-300">
              {item.category}
            </span>
          </div>
        }
        subtitle={
          <span className="text-xs text-slate-400 font-mono">{item.rfc}</span>
        }
      >
        {/* Flags Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 font-bold mb-1">
              Safe
            </span>
            {item.isSafe ? (
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> YES
              </span>
            ) : (
              <span className="text-slate-500 font-bold text-xs flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> NO
              </span>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 font-bold mb-1">
              Idempotent
            </span>
            {item.isIdempotent ? (
              <span className="text-blue-400 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> YES
              </span>
            ) : (
              <span className="text-slate-500 font-bold text-xs flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> NO
              </span>
            )}
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 font-bold mb-1">
              Cacheable
            </span>
            {item.isCacheable ? (
              <span className="text-purple-400 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> YES
              </span>
            ) : (
              <span className="text-slate-500 font-bold text-xs flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> NO
              </span>
            )}
          </div>
        </div>

        {/* Specification */}
        <section className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Specification & Semantics</span>
          </div>
          <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
            {item.description}
          </p>
        </section>

        {/* Typical Use Cases */}
        <section className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Typical Use Cases</span>
          </div>
          <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
            {item.useCase}
          </p>
        </section>

        {/* Code Generator Snippets */}
        <section className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Request Example</span>
            </div>

            <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
              {(["CURL", "FETCH", "JAVA"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab === "JAVA"
                    ? "Spring"
                    : tab === "FETCH"
                      ? "fetch()"
                      : "cURL"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed max-h-56 scrollbar-thin scrollbar-thumb-slate-800">
              {activeSnippet}
            </pre>

            <div className="absolute top-2.5 right-2.5">
              <CopyButton
                textToCopy={activeSnippet}
                title="Copy Snippet"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md inline-flex items-center justify-center"
              />
            </div>
          </div>
        </section>
      </Drawer>
    );
  },
);

HttpMethodDrawer.displayName = "HttpMethodDrawer";
