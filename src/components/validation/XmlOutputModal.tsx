import React, { useEffect } from "react";
import { Check, Code2, Copy, Download, X } from "lucide-react";

interface XmlOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  xmlContent: string;
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
  schemaName?: string;
}

export const XmlOutputModal: React.FC<XmlOutputModalProps> = ({
  isOpen,
  onClose,
  xmlContent,
  onCopy,
  onDownload,
  copied,
  schemaName,
}) => {
  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#10192c] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0b111e]/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Generated XML Schema Output
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {schemaName ? `${schemaName}.xml` : "validation.xml"} •
                /api/v1/validation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10192c] hover:bg-slate-800 text-blue-400 border border-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition cursor-pointer ml-1"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / Code Area */}
        <div className="p-6 overflow-y-auto bg-[#070c18] flex-1">
          <pre className="text-slate-300 font-mono text-xs leading-relaxed select-all whitespace-pre">
            {xmlContent || "<empty />"}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800/80 bg-[#0b111e]/50 text-xs text-slate-400">
          <span>Total characters: {xmlContent.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
