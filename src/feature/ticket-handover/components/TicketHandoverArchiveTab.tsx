import React from "react";
import { Archive, ArrowUpRight, Clock, Trash2 } from "lucide-react";
import type { ArchivedTicketHandover } from "../models/ticketHandover.model";

interface TicketHandoverArchiveTabProps {
  archive: ArchivedTicketHandover[];
  onLoadHandover: (item: ArchivedTicketHandover) => void;
  onDeleteHandover: (ticketId: string) => void;
}

export const TicketHandoverArchiveTab: React.FC<
  TicketHandoverArchiveTabProps
> = ({ archive, onLoadHandover, onDeleteHandover }) => {
  if (archive.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto border border-slate-700">
          <Archive className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-300">
            No handovers archived
          </p>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            Provide a Ticket ID and click &quot;Save&quot; to preserve handovers
            locally.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Archive className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Handover Archive
          </h2>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {archive.length} / 10 saved
        </span>
      </div>

      <div className="space-y-2.5">
        {archive.map((item) => {
          const date = new Date(item.savedAt).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={item.ticketId}
              className="p-3.5 bg-[#0b111e] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between gap-4 transition group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-emerald-400 tracking-wider">
                    #{item.ticketId}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    {item.scenario}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {date}
                  </span>
                  {item.recipientEmail && (
                    <span>&bull; {item.recipientEmail}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onLoadHandover(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Load into editor"
                >
                  <span>Load</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteHandover(item.ticketId)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  title="Delete from archive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
