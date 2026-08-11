import React, { useState } from "react";
import { Check, Copy, Monitor, Save, X } from "lucide-react";
import { ReviewModel } from "../../models/review.model.ts";

interface DemoNotesModalProps {
  review: ReviewModel;
  onClose: () => void;
  onSaveNotes?: (id: string, newNotes: string) => Promise<void>;
}

export const DemoNotesModal: React.FC<DemoNotesModalProps> = ({
  review,
  onClose,
  onSaveNotes,
}) => {
  const [notes, setNotes] = useState(review.demoNotes || "");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!onSaveNotes) return;
    setIsSaving(true);
    await onSaveNotes(review.id, notes);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 font-sans text-xs">
      <div className="w-[80vw] h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-400">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-indigo-400 font-bold">
                  {review.ticketNumber}
                </span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-extrabold text-white">
                  {review.title}
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Live Demo Steps & Notes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 font-bold transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
              <span>{copied ? "Copied" : "Copy Notes"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 min-h-0 bg-slate-950/40 space-y-4">
          <label className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block">
            Demo Instructions & Script
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="No notes defined for this live demo..."
            className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
          />
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0 text-slate-400">
          <span className="text-[11px]">
            Tip: You can edit and update demo notes directly in this view.
          </span>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer transition-colors"
            >
              Close
            </button>
            {onSaveNotes && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
