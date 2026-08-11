import React from "react";

interface MarkdownPreviewProps {
  text: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ text }) => {
  if (!text) {
    return (
      <span className="text-slate-500 italic">
        Live-Vorschau erscheint hier beim Schreiben...
      </span>
    );
  }

  const formatInline = (content: string) => {
    const parts = content.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-[11px] border border-slate-700/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      const boldParts = part.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
      return boldParts.map((bPart, j) => {
        if (
          (bPart.startsWith("**") && bPart.endsWith("**")) ||
          (bPart.startsWith("__") && bPart.endsWith("__"))
        ) {
          return (
            <strong key={j} className="font-bold text-white">
              {bPart.slice(2, -2)}
            </strong>
          );
        }

        const italicParts = bPart.split(/(\*[^*]+\*|_[^_]+_)/g);
        return italicParts.map((iPart, k) => {
          if (
            (iPart.startsWith("*") && iPart.endsWith("*")) ||
            (iPart.startsWith("_") && iPart.endsWith("_"))
          ) {
            return (
              <em key={k} className="italic text-slate-200">
                {iPart.slice(1, -1)}
              </em>
            );
          }
          return iPart;
        });
      });
    });
  };

  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
          return <hr key={idx} className="my-3 border-t border-slate-700" />;
        }
        if (line.startsWith("# ")) {
          return (
            <h1
              key={idx}
              className="text-lg font-extrabold text-white my-2 border-b border-slate-800 pb-1"
            >
              {formatInline(line.replace("# ", ""))}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-base font-bold text-slate-100 my-1.5">
              {formatInline(line.replace("## ", ""))}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-sm font-bold text-slate-200 my-1">
              {formatInline(line.replace("### ", ""))}
            </h3>
          );
        }
        if (line.startsWith("#### ")) {
          return (
            <h4 key={idx} className="text-xs font-bold text-slate-300 my-1">
              {formatInline(line.replace("#### ", ""))}
            </h4>
          );
        }
        if (line.startsWith("##### ")) {
          return (
            <h5 key={idx} className="text-xs font-semibold text-slate-400 my-1">
              {formatInline(line.replace("##### ", ""))}
            </h5>
          );
        }
        if (line.startsWith("###### ")) {
          return (
            <h6
              key={idx}
              className="text-[11px] font-semibold text-slate-400 my-1"
            >
              {formatInline(line.replace("###### ", ""))}
            </h6>
          );
        }

        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={idx} className="ml-4 list-disc text-slate-300 my-0.5">
              {formatInline(line.substring(2))}
            </li>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={idx} className="ml-4 list-decimal text-slate-300 my-0.5">
              {formatInline(line.replace(/^\d+\.\s/, ""))}
            </li>
          );
        }

        if (line.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-blue-500 pl-3 py-0.5 text-slate-400 italic my-1 bg-slate-900/50 rounded-r"
            >
              {formatInline(line.replace("> ", ""))}
            </blockquote>
          );
        }

        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        return (
          <p key={idx} className="text-slate-300 leading-relaxed my-0.5">
            {formatInline(line)}
          </p>
        );
      })}
    </>
  );
};
