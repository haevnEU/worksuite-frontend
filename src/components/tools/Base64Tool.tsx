import React, { useState } from "react";
import { ArrowLeftRight, Check, Copy, FileCode, Upload } from "lucide-react";

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = (text: string, dir: "encode" | "decode") => {
    setInput(text);
    setError(null);
    if (!text.trim()) {
      setOutput("");
      return;
    }

    try {
      if (dir === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError("Invalid Base64 string for decoding.");
      setOutput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOutput(result);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Base64 Encoder / Decoder
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#0b111e] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setMode("text");
                setOutput("");
                setInput("");
              }}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                mode === "text"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("file");
                setOutput("");
                setInput("");
              }}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                mode === "file"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              File / Image
            </button>
          </div>

          {mode === "text" && (
            <button
              type="button"
              onClick={() => {
                const nextDir = direction === "encode" ? "decode" : "encode";
                setDirection(nextDir);
                handleConvert(output || input, nextDir);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b111e] hover:bg-slate-800 text-blue-400 border border-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{direction === "encode" ? "Encoding" : "Decoding"}</span>
            </button>
          )}
        </div>
      </div>

      {mode === "text" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-400">
              Input ({direction === "encode" ? "Plaintext" : "Base64"})
            </label>
            <textarea
              rows={5}
              value={input}
              placeholder={
                direction === "encode"
                  ? "Enter plaintext to encode..."
                  : "Enter Base64 to decode..."
              }
              className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 text-xs font-mono resize-none transition"
              onChange={(e) => handleConvert(e.target.value, direction)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-400">
                Output ({direction === "encode" ? "Base64" : "Plaintext"})
              </label>
              {output && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-sans cursor-pointer"
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
              rows={5}
              readOnly
              value={error || output}
              placeholder="Output will appear here..."
              className={`w-full bg-[#0b111e] border rounded-xl p-3 text-xs font-mono resize-none ${
                error
                  ? "border-rose-500/50 text-rose-400"
                  : "border-slate-800 text-slate-200"
              }`}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-blue-600/20 transition">
              <Upload className="w-4 h-4" />
              <span>Select File or Image to Base64</span>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-xs text-slate-400">
              Converts file to Base64 Data URL
            </span>
          </div>

          {output && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Base64 Output:
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-sans cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <textarea
                rows={4}
                readOnly
                value={output}
                className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 text-xs font-mono select-all"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
