import React, { useState } from "react";
import { ArrowLeftRight, Check, Copy, Link } from "lucide-react";

export const UrlEncoderTool: React.FC = () => {
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = (text: string, dir: "encode" | "decode") => {
    setInput(text);
    if (!text.trim()) {
      setOutput("");
      return;
    }

    try {
      setOutput(
        dir === "encode" ? encodeURIComponent(text) : decodeURIComponent(text),
      );
    } catch {
      setOutput("Error decoding URI sequence");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            URL / URI Encoder & Decoder
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            const next = direction === "encode" ? "decode" : "encode";
            setDirection(next);
            handleConvert(output || input, next);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b111e] hover:bg-slate-800 text-purple-400 border border-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>
            {direction === "encode"
              ? "encodeURIComponent"
              : "decodeURIComponent"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">
            {direction === "encode" ? "Plain URL / Query" : "Encoded URL"}
          </label>
          <textarea
            rows={4}
            value={input}
            placeholder="https://example.com/api?q=hello world & foo=bar"
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-xs font-mono resize-none transition"
            onChange={(e) => handleConvert(e.target.value, direction)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-400">
              Output
            </label>
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-sans cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>
          <textarea
            rows={4}
            readOnly
            value={output}
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 text-xs font-mono resize-none"
          />
        </div>
      </div>
    </div>
  );
};
