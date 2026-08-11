import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, Terminal } from "lucide-react";
import { LogEntry } from "../../models/log.model.ts";
import { LogItem } from "./LogItem.tsx";

interface LogTerminalViewProps {
  logs: LogEntry[];
  filteredLogs: LogEntry[];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const LogTerminalView: React.FC<LogTerminalViewProps> = ({
  logs,
  filteredLogs,
  copiedId,
  onCopy,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const scrollToBottom = () => {
    setAutoScroll(true);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-320px)] min-h-[400px]">
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-bold text-slate-300">console.stream</span>
        </div>
        <div>
          Showing{" "}
          <strong className="text-indigo-400">{filteredLogs.length}</strong> of{" "}
          <strong className="text-indigo-400">{logs.length}</strong> entries
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-2">
            <Terminal className="w-8 h-8 opacity-40" />
            <p className="text-xs font-semibold">No log output available</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <LogItem
              key={log.id}
              log={log}
              copiedId={copiedId}
              onCopy={onCopy}
            />
          ))
        )}
      </div>

      {!autoScroll && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-6 flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all animate-bounce cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Scroll to bottom</span>
        </button>
      )}
    </div>
  );
};
