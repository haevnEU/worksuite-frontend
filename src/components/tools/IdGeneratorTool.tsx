import React, { useState } from "react";
import { Check, Copy, Fingerprint, RefreshCw } from "lucide-react";

const generateUuidV7 = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  const timestamp = Date.now();
  bytes[0] = (timestamp >> 40) & 0xff;
  bytes[1] = (timestamp >> 32) & 0xff;
  bytes[2] = (timestamp >> 24) & 0xff;
  bytes[3] = (timestamp >> 16) & 0xff;
  bytes[4] = (timestamp >> 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const IdGeneratorTool: React.FC = () => {
  const [type, setType] = useState<"uuidv4" | "uuidv7">("uuidv4");
  const [count, setCount] = useState<number>(5);
  const [generated, setGenerated] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateBatch = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      if (type === "uuidv4") results.push(crypto.randomUUID());
      else if (type === "uuidv7") results.push(generateUuidV7());
    }
    setGenerated(results);
  };

  const copyAll = () => {
    if (generated.length === 0) return;
    navigator.clipboard.writeText(generated.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            UUID Generator
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="uuidv4">UUID v4 (Random)</option>
            <option value="uuidv7">UUID v7 (Time-Ordered)</option>
          </select>

          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {[1, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "Item" : "Items"}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={generateBatch}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-amber-600/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            Generated Batch Output:
          </span>
          {generated.length > 0 && (
            <button
              type="button"
              onClick={copyAll}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-sans cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied All" : "Copy All"}</span>
            </button>
          )}
        </div>

        <textarea
          rows={Math.min(count, 8)}
          readOnly
          value={generated.join("\n")}
          placeholder="Click 'Generate' to create IDs..."
          className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 text-xs font-mono resize-none select-all"
        />
      </div>
    </div>
  );
};
