import React, { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { Modal } from "../../../shared/components/Modal.tsx";

interface LogPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
}

export const LogPasteModal: React.FC<LogPasteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [content, setContent] = useState("");
  const [logName, setLogName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(11, 19);
    const fileName = logName.trim()
      ? `${logName.trim().replace(/\s+/g, "_")}.log`
      : `pasted-log-${timestamp}.log`;

    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], fileName, { type: "text/plain" });

    onConfirm(file);
    setContent("");
    setLogName("");
    onClose();
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setContent(text);
    } catch {}
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<Clipboard className="w-4 h-4" />}
      title="Paste Raw Logs"
      subtitle="Paste log text, console output, or stacktraces directly"
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input
            type="text"
            value={logName}
            onChange={(e) => setLogName(e.target.value)}
            placeholder="Tab / File Name (optional, e.g. auth-service-error)"
            className="bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 flex-1 font-mono"
          />
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste from Clipboard</span>
          </button>
        </div>

        <textarea
          required
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste raw log lines here... (e.g. 2026-09-11 19:45:00.123 ERROR [AuthService] Token expired...)"
          className="w-full bg-[#0b111e] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono leading-relaxed resize-none"
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-600/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Load into Viewer</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
