import React, { useState } from "react";
import {
  Wrench,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Globe,
  FileCode,
  Hash,
  Clock,
  Fingerprint,
  Link,
} from "lucide-react";

export const ToolsHeader: React.FC = () => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Developer Toolbox
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Offline Utilities
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Offline-ready encoders, cryptographic hash generators, batch UUID
              creators, and timestamp converters.
            </p>
          </div>
        </div>

        {/* Guide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer self-start md:self-center shrink-0 ${
            showGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle developer tools guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guide</span>
          {showGuide ? (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>

      {/* Collapsible Tool Guide Section */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Developer Utilities Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* 1. HTTP Request Builder */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span>HTTP Request Builder</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Compose REST payloads, configure request headers, and export
                  instant cURL commands or JS Fetch snippets.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Outputs: cURL & Fetch (JS)</span>
              </div>
            </div>

            {/* 2. Base64 Encoder / Decoder */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span>Base64 Tool</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Encode/decode raw UTF-8 strings or convert files and images
                  directly into Base64 Data URL format.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-indigo-300 border-t border-slate-800/40">
                <span>Supports: Text, Images, Files</span>
              </div>
            </div>

            {/* 3. Checksum & Hash Generator */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span>Hash Generator</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Calculate MD5, SHA-256, and SHA-512 hashes simultaneously with
                  instant checksum verification.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>MD5 · SHA-256 · SHA-512</span>
              </div>
            </div>

            {/* 4. Epoch / Unix Timestamp Converter */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Epoch Converter</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Translate Unix epoch values (seconds/milliseconds) into
                  human-readable ISO 8601, UTC, and local times.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-cyan-300 border-t border-slate-800/40">
                <span>ISO 8601 · UTC · Local Time</span>
              </div>
            </div>

            {/* 5. UUID Generator */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <Fingerprint className="w-3.5 h-3.5 shrink-0" />
                  <span>UUID Generator</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Batch generate cryptographically secure UUID v4 (random) and
                  UUID v7 (time-ordered) identifiers.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-amber-300 border-t border-slate-800/40">
                <span>UUID v4 (Random) & UUID v7</span>
              </div>
            </div>

            {/* 6. URL / URI Encoder & Decoder */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <Link className="w-3.5 h-3.5 shrink-0" />
                  <span>URL Encoder</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sanitize and encode query parameters or decode percent-encoded
                  URL strings safely.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                <span>encodeURIComponent / decode</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
