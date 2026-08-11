import React from "react";
import { Copy, Edit, FileText, Trash2 } from "lucide-react";
import { NoteResource } from "../../models/noteResource.model.ts";
import { noteService } from "../../services/network/note.service.ts";
import { useToast } from "../../toaster/ToastContext.tsx";
import { TICKET_URL } from "../../constants/url.constant.ts";
import { useSettings } from "../../context/SettingsContext.tsx";

interface NoteCardProps {
  note: NoteResource;
  onEdit: (note: NoteResource) => void;
  onDelete: (note: NoteResource) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
}) => {
  const { toastInfo } = useToast();
  const { isDraft } = useSettings();

  const copyNote = async () => {
    await navigator.clipboard.writeText(note.content);
    toastInfo("Copied to clipboard!");
  };

  const exportNote = async () => {
    await noteService.exportPdf(note.id, isDraft);
  };

  const renderNoteLink = () => {
    const visitNote = (ticketId?: string) => {
      if (ticketId) {
        window.open(`${TICKET_URL}/issues/${ticketId}`, "_blank");
      }
    };

    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 shrink-0 ${
          note.ticketId
            ? "cursor-pointer hover:bg-blue-900 transition-colors"
            : "cursor-default"
        }`}
        onClick={() => visitNote(note.ticketId)}
      >
        {note.ticketId || "No Ticket"}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-white">{note.title}</h3>
          {renderNoteLink()}
        </div>
        <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 leading-relaxed max-h-48 overflow-y-auto">
          {note.content}
        </pre>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <span className="text-[10px] text-slate-500">
          {note.createdAt ? `Created: ${note.createdAt}` : ""}
        </span>
        <div className="flex items-center space-x-2">
          <button
            title="Edit note"
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
            onClick={() => onEdit(note)}
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            title="Copy text"
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors cursor-pointer"
            onClick={copyNote}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            title="Export note"
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center space-x-1 cursor-pointer"
            onClick={exportNote}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Export</span>
          </button>
          <button
            title="Delete note"
            onClick={() => onDelete(note)}
            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
