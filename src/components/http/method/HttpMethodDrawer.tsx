import React, { useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  Layers,
  Terminal,
  X,
  XCircle,
} from "lucide-react";
import { getMethodBadgeColor } from "../../../utils/http.util.ts";
import { HttpMethodDetail } from "../../../models/network.model.ts";

interface HttpMethodDrawerProps {
  item: HttpMethodDetail | null;
  onClose: () => void;
}

export const HttpMethodDrawer: React.FC<HttpMethodDrawerProps> = ({
  item,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"CURL" | "FETCH" | "JAVA">("CURL");
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  // cURL Command Generator
  const generateCurlSnippet = () => {
    let cmd = `curl -X ${item.method} "https://api.worksuite.local${item.sampleEndpoint}" \\\n  -H "Authorization: Bearer <access_token>"`;

    if (item.sampleHeaders) {
      Object.entries(item.sampleHeaders).forEach(([header, value]) => {
        cmd += ` \\\n  -H "${header}: ${value}"`;
      });
    }

    if (item.samplePayload) {
      // Escape for bash/zsh command line
      cmd += ` \\\n  -d '${item.samplePayload.replace(/'/g, "\\'")}'`;
    }

    return cmd;
  };

  // Modern JavaScript / TypeScript Fetch Snippet Generator
  const generateFetchSnippet = () => {
    const options: Record<string, unknown> = {
      method: item.method,
      headers: {
        Authorization: "Bearer <access_token>",
        ...(item.sampleHeaders || {}),
      },
    };

    if (item.samplePayload) {
      try {
        options.body = JSON.parse(item.samplePayload);
      } catch {
        options.body = item.samplePayload;
      }
    }

    const payloadString = item.samplePayload
      ? `\n  body: JSON.stringify(${JSON.stringify(JSON.parse(item.samplePayload), null, 4)}),`
      : "";

    const headersString = Object.entries(
      options.headers as Record<string, string>,
    )
      .map(([k, v]) => `    "${k}": "${v}",`)
      .join("\n");

    return `const response = await fetch("https://api.worksuite.local${item.sampleEndpoint}", {
  method: "${item.method}",
  headers: {
${headersString}
  },${payloadString}
});

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

const data = await response.json();`;
  };

  // Spring Boot Controller Snippet Generator
  const generateJavaSnippet = () => {
    const springAnnotationMap: Record<string, string> = {
      GET: "@GetMapping",
      POST: "@PostMapping",
      PUT: "@PutMapping",
      PATCH: "@PatchMapping",
      DELETE: "@DeleteMapping",
    };

    const annotation =
      springAnnotationMap[item.method] ||
      `@RequestMapping(method = RequestMethod.${item.method})`;
    const requestBodyParam = item.samplePayload
      ? `@Valid @RequestBody final RequestDTO request`
      : ``;

    return `${annotation}("${item.sampleEndpoint}")
public ResponseEntity<ResponseDTO> handle${item.method.charAt(0) + item.method.slice(1).toLowerCase()}(${requestBodyParam}) {
    // Business logic...
    return ResponseEntity.ok(response);
}`;
  };

  const getCurrentSnippet = () => {
    switch (activeTab) {
      case "CURL":
        return generateCurlSnippet();
      case "FETCH":
        return generateFetchSnippet();
      case "JAVA":
        return generateJavaSnippet();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 xl:hidden animate-in fade-in duration-200"
      />

      <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-6 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
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
            <span className="text-xs text-slate-400 font-mono">{item.rfc}</span>
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Method Flags Grid */}
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

          {/* Description */}
          <section className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Specification & Semantics</span>
            </div>
            <p className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
              {item.description}
            </p>
          </section>

          {/* Primary Use Case */}
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
                <button
                  type="button"
                  onClick={() => setActiveTab("CURL")}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                    activeTab === "CURL"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  cURL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("FETCH")}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                    activeTab === "FETCH"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  fetch()
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("JAVA")}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                    activeTab === "JAVA"
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Spring
                </button>
              </div>
            </div>

            <div className="relative group">
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed max-h-56 scrollbar-thin scrollbar-thumb-slate-800">
                {getCurrentSnippet()}
              </pre>

              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
                title="Copy Snippet"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
};
