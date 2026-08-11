import React from "react";
import { X } from "lucide-react";
import { NoteFormDraft } from "../../models/note.model.ts";

interface NoteModalProps {
  isOpen: boolean;
  form: NoteFormDraft;
  onFormChange: (updated: NoteFormDraft) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  form,
  onFormChange,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
      <div className="bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              {form.id ? "Edit Note" : "Create a new Note"}
            </h3>
            {form.id && (
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                ID: {form.id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) => onFormChange({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Ticket-ID
            </label>
            <input
              type="text"
              value={form.ticketId || ""}
              placeholder="e.g. 12345"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) =>
                onFormChange({ ...form, ticketId: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Content *
            </label>
            <textarea
              required
              rows={5}
              value={form.content}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={(e) =>
                onFormChange({ ...form, content: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              className="px-4 py-2 text-slate-400 hover:text-white font-semibold cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              {form.id ? "Update note" : "Save note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
