import React, { useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { mapLanguageForPrism } from "../../utils/snippet.util.ts";
import { SnippetLanguage } from "../../types/snippet.type.ts";

interface SnippetCodeEditorProps {
  value: string;
  language: SnippetLanguage;
  onChange: (value: string) => void;
}

export const SnippetCodeEditor: React.FC<SnippetCodeEditorProps> = ({
  value,
  language,
  onChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlighterRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (textareaRef.current && highlighterRef.current) {
      highlighterRef.current.scrollTop = textareaRef.current.scrollTop;
      highlighterRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="relative h-52 w-full rounded-lg border border-slate-700 bg-slate-950 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20">
      <div
        ref={highlighterRef}
        className="absolute inset-0 pointer-events-none overflow-hidden p-3"
        style={{ boxSizing: "border-box" }}
      >
        <SyntaxHighlighter
          language={mapLanguageForPrism(language)}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: 0,
            fontSize: "12px",
            lineHeight: "1.6",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            background: "transparent",
            tabSize: 2,
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: "12px",
              lineHeight: "1.6",
            },
          }}
          wrapLongLines={false}
        >
          {value ? value + "\n" : " "}
        </SyntaxHighlighter>
      </div>

      <textarea
        ref={textareaRef}
        required
        rows={6}
        value={value}
        onScroll={handleScroll}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const target = e.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const val = target.value;
            const newValue =
              val.substring(0, start) + "  " + val.substring(end);
            onChange(newValue);
            setTimeout(() => {
              target.selectionStart = target.selectionEnd = start + 2;
            }, 0);
          }
        }}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-white font-mono text-xs leading-relaxed resize-none focus:outline-none whitespace-pre overflow-auto"
        style={{
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontSize: "12px",
          lineHeight: "1.6",
          tabSize: 2,
          boxSizing: "border-box",
        }}
        placeholder="Enter code here..."
      />
    </div>
  );
};
