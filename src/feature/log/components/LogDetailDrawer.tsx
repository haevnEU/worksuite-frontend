import React, { useEffect } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import type { LogEntry } from "../models/log.model";
import { CopyButton } from "../../../shared/components/CopyButton.tsx";
import { Drawer } from "../../../shared/components/Drawer.tsx";

interface LogDetailDrawerProps {
  entry: LogEntry;
  drawerRowIndex: number;
  totalRows: number;
  onClose: () => void;
  onNavigate: (direction: "up" | "down") => void;
}

export const LogDetailDrawer: React.FC<LogDetailDrawerProps> = React.memo(
  ({ entry, drawerRowIndex, totalRows, onClose, onNavigate }) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          onNavigate("up");
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          onNavigate("down");
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onNavigate]);

    return (
      <Drawer
        isOpen={Boolean(entry)}
        onClose={onClose}
        widthClass="max-w-2xl sm:w-[670px]"
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  Line #{entry.lineNumber}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Entry {drawerRowIndex + 1} of {totalRows}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigate("up")}
                disabled={drawerRowIndex === 0}
                className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
                title="Previous Line (Up Arrow)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("down")}
                disabled={drawerRowIndex === totalRows - 1}
                className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
                title="Next Line (Down Arrow)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
        subtitle={
          <div className="flex items-center justify-between text-[11px] bg-[#10192c] px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 mt-2">
            <div className="flex items-center space-x-2">
              <span>Shortcuts:</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-blue-400 font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-blue-400 font-mono">
                ↓
              </kbd>
              <span>· ESC Close</span>
            </div>

            <CopyButton
              textToCopy={entry.rawText}
              title="Copy Raw Text"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-sans cursor-pointer text-[11px]"
            />
          </div>
        }
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Level
              </span>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0b111e] text-slate-200">
                {entry.level}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Timestamp
              </span>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0b111e] text-slate-200">
                {entry.timestamp || "N/A"}
              </div>
            </div>
          </div>

          {entry.logger && (
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Logger / Class
              </span>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0b111e] text-slate-200 select-all">
                {entry.logger}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
              Full Payload / Multiline Details
            </span>
            <pre className="p-4 rounded-xl border border-slate-800 bg-[#0b111e] text-slate-200 whitespace-pre-wrap break-all leading-relaxed max-h-[440px] overflow-y-auto select-all">
              {entry.rawText}
            </pre>
          </div>
        </div>
      </Drawer>
    );
  },
);

LogDetailDrawer.displayName = "LogDetailDrawer";
