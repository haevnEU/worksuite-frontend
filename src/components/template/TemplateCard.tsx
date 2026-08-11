import React from "react";
import { Copy, FileText, Tag, Trash2 } from "lucide-react";
import { TemplateResource } from "../../models/templateResource.model.ts";
import { templateService } from "../../services/network/template.service.ts";
import { useToast } from "../../toaster/ToastContext.tsx";
import { ExportType } from "../../types/http.type.ts";
import { getFileExtension, getMediaType } from "../../utils/file.util.ts";

interface TemplateCardProps {
  template: TemplateResource;
  onDelete: (template: TemplateResource) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onDelete,
}) => {
  const { toastInfo } = useToast();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toastInfo("Template successfully copied to clipboard.");
  };

  const handleExport = (exportType: ExportType) => {
    const json = JSON.stringify(template, null, 2);
    templateService.downloadString(
      json,
      `${template.title}${getFileExtension(exportType)}`,
      getMediaType(exportType),
    );
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white">
                {template.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {template.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold flex items-center space-x-1"
                >
                  <Tag className="w-2.5 h-2.5 text-slate-500" />
                  <span>#{tag}</span>
                </span>
              ))}
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800 shrink-0 capitalize">
            {template.platform}
          </span>
        </div>
        <pre className="bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-xl overflow-x-auto border border-slate-800 leading-relaxed whitespace-pre-wrap max-h-64">
          {template.content}
        </pre>
        {template.createdAt && (
          <p className="text-[10px] text-slate-500 font-medium pt-1">
            Created: {template.createdAt}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
        <span className="text-[10px] text-slate-500 font-mono">
          {template.id}
        </span>
        <div className="flex items-center space-x-2">
          <button
            title="Copy text"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
            onClick={() => handleCopy(template.content)}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleExport("txt")}
            title="Download as .txt file"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center space-x-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Export (.txt)</span>
          </button>
          <button
            onClick={() => handleExport("json")}
            title="Download as .json file"
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center space-x-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Export (.json)</span>
          </button>
          <button
            onClick={() => onDelete(template)}
            title="Delete template"
            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
