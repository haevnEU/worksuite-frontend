import React, { useMemo, useState } from "react";
import {
  Code2,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRightLeft,
  Terminal,
  Layers,
  HelpCircle,
} from "lucide-react";
import {
  executeRegexTest,
  toJavaRegexLiteral,
  fromJavaRegexLiteral,
  generateJavaSnippet,
} from "../../utils/regex.util.ts";

export const RegexTesterTool: React.FC = () => {
  const [pattern, setPattern] = useState<string>("([A-Z]+)-(\\d{4})");
  const [testText, setTestText] = useState<string>(
    "Logs: JIRA-1024 status updated to IN_PROGRESS.\nRef ticket: TASK-4092 closed by dev.",
  );

  // Flags
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [dotAll, setDotAll] = useState(false);

  // Reverse Java Input
  const [javaInput, setJavaInput] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const testResult = useMemo(() => {
    return executeRegexTest(
      pattern,
      { caseInsensitive, multiline, dotAll },
      testText,
    );
  }, [pattern, caseInsensitive, multiline, dotAll, testText]);

  const javaLiteral = useMemo(() => toJavaRegexLiteral(pattern), [pattern]);

  const javaCodeSnippet = useMemo(() => {
    return generateJavaSnippet(
      pattern,
      { global: true, caseInsensitive, multiline, dotAll },
      "pattern",
    );
  }, [pattern, caseInsensitive, multiline, dotAll]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleImportFromJava = () => {
    if (!javaInput.trim()) return;
    const extracted = fromJavaRegexLiteral(javaInput);
    setPattern(extracted);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shrink-0">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Regex Tester & Java Converter
            </h2>
            <p className="text-[11px] text-slate-400">
              Live matching, capture groups evaluation, and bidirectional Java
              String escaping.
            </p>
          </div>
        </div>

        {/* Flag Toggles */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-800 bg-slate-950 p-1 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setCaseInsensitive(!caseInsensitive)}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              caseInsensitive
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Case Insensitive (i)"
          >
            i
          </button>
          <button
            type="button"
            onClick={() => setMultiline(!multiline)}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              multiline
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Multiline (m)"
          >
            m
          </button>
          <button
            type="button"
            onClick={() => setDotAll(!dotAll)}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              dotAll
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="DotAll / Singleline (s)"
          >
            s
          </button>
        </div>
      </div>

      {/* Pattern Input Box */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Regular Expression
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-500 select-none">
            /
          </span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. ([A-Z]+)-(\d+)"
            className={`w-full rounded-xl border bg-slate-950 pl-8 pr-16 py-2.5 font-mono text-xs sm:text-sm text-emerald-400 placeholder-slate-600 focus:outline-none transition-colors ${
              testResult.isValid
                ? "border-slate-800 focus:border-blue-500"
                : "border-rose-500/80 focus:border-rose-500"
            }`}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500 select-none">
            /{caseInsensitive ? "i" : ""}
            {multiline ? "m" : ""}
            {dotAll ? "s" : ""}g
          </span>
        </div>

        {!testResult.isValid && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/20 p-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{testResult.error}</span>
          </div>
        )}
      </div>

      {/* 2-Spalten Split: Live Matching (Links) & Java Snippets/Converter (Rechts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Links: Test String, Highlighting & Groups */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Test String
              </label>
              <span className="font-mono text-[10px] text-slate-500">
                {testResult.matches.length} matches
              </span>
            </div>
            <textarea
              rows={4}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Paste input string to test..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Highlighted Preview
              </span>
              <div
                className="max-h-36 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text scrollbar-thin scrollbar-thumb-slate-800"
                dangerouslySetInnerHTML={{ __html: testResult.highlightedHtml }}
              />
            </div>
          </div>

          {/* Matches & Capture Groups */}
          {testResult.matches.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                Match Groups ({testResult.matches.length})
              </span>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {testResult.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-2.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-emerald-400">
                        Match #{idx + 1}: &quot;{m.match}&quot;
                      </span>
                      <span className="text-[10px] text-slate-500">
                        pos: {m.index}..{m.index + m.match.length}
                      </span>
                    </div>
                    {m.groups.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/50">
                        {m.groups.map((g, gIdx) => (
                          <div
                            key={gIdx}
                            className="flex items-center justify-between rounded bg-slate-950 px-2 py-0.5 font-mono text-[11px] text-slate-300 border border-slate-800/60"
                          >
                            <span className="text-slate-500">
                              Group {gIdx + 1}:
                            </span>
                            <span className="font-semibold text-blue-300 ml-2 truncate">
                              {g ?? "null"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rechts: Java Regex Converter */}
        <div className="lg:col-span-5 space-y-4">
          {/* Java String Literal */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Java String Literal
              </span>
              <button
                type="button"
                onClick={() => handleCopy(`"${javaLiteral}"`, "literal")}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedKey === "literal" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>Copy</span>
              </button>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-amber-300 break-all select-all">
              &quot;{javaLiteral}&quot;
            </div>
            <p className="text-[10px] text-slate-500">
              Auto-escaped for Java source code (backslashes doubled).
            </p>
          </div>

          {/* Reverse: From Java literal to clean Regex */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <ArrowRightLeft className="h-3.5 w-3.5 text-blue-400" />
              Reverse from Java String
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={javaInput}
                onChange={(e) => setJavaInput(e.target.value)}
                placeholder='Paste: "([A-Z]+)-\\d{4}"'
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleImportFromJava}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition cursor-pointer shrink-0"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Java Pattern & Matcher Snippet */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-purple-400" />
                Java Boilerplate
              </span>
              <button
                type="button"
                onClick={() => handleCopy(javaCodeSnippet, "code")}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer"
              >
                {copiedKey === "code" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>Copy</span>
              </button>
            </div>
            <pre className="max-h-40 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-2.5 font-mono text-[10px] sm:text-[11px] text-purple-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
              {javaCodeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
