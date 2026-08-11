import React from "react";
import { Copy, Edit, Trash2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ShareableResource } from "../../models/shareableResource.model.ts";
import { useToast } from "../../toaster/ToastContext.tsx";
import {
  getLanguageBadgeColor,
  mapLanguageForPrism,
} from "../../utils/snippet.util.ts";

interface SnippetCardProps {
  snippet: ShareableResource;
  onEdit: (snippet: ShareableResource) => void;
  onDelete: (snippet: ShareableResource) => void;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onEdit,
  onDelete,
}) => {
  const { toastInfo } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.content);
    toastInfo("Copied to clipboard!");
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 overflow-hidden">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-white">{snippet.title}</h3>
          {snippet.language && (
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 font-mono capitalize ${getLanguageBadgeColor(
                snippet.language,
              )}`}
            >
              {snippet.language.replace("cpp", "c++").replace("sharp", "#")}
            </span>
          )}
        </div>

        <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
          <SyntaxHighlighter
            language={mapLanguageForPrism(snippet.language)}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "0.75rem",
              fontSize: "0.75rem",
              lineHeight: "1.5",
              maxHeight: "12rem",
              background: "#020617",
            }}
            wrapLongLines={true}
          >
            {snippet.content}
          </SyntaxHighlighter>
        </div>

        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="text-[10px] text-slate-500 font-mono">
          ID #{snippet.id}
        </span>
        <div className="flex items-center space-x-2">
          <button
            title="Edit snippet"
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
            onClick={() => onEdit(snippet)}
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            title="Copy content"
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
            onClick={handleCopy}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            title="Delete snippet"
            onClick={() => onDelete(snippet)}
            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
