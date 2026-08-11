import React, { useState } from "react";
import { Check, Hash, Tag } from "lucide-react";
import { DatabaseMap } from "../../types/databaseRecord.type.ts";
import { DatabaseRecord } from "../../models/databaseRecord.model.ts";

interface CardViewProps {
  data: DatabaseMap | DatabaseRecord[];
  copyIdOnly: boolean;
}

export const CardView: React.FC<CardViewProps> = ({ data, copyIdOnly }) => {
  const isMap = !Array.isArray(data);

  if (isMap) {
    const mapData = data as DatabaseMap;
    const entries = Object.entries(mapData);

    if (entries.length === 0) {
      return <EmptyState text="No data available in map." />;
    }

    return (
      <div className="space-y-8">
        {entries.map(([tableName, records]) => (
          <div key={tableName} className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Tag className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-300 capitalize">
                {tableName}
              </h3>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {records.length}
              </span>
            </div>
            <RecordGrid records={records} copyIdOnly={copyIdOnly} />
          </div>
        ))}
      </div>
    );
  }

  const recordList = data as DatabaseRecord[];
  if (recordList.length === 0) {
    return <EmptyState text="No records found." />;
  }

  return <RecordGrid records={recordList} copyIdOnly={copyIdOnly} />;
};

const RecordGrid: React.FC<{
  records: DatabaseRecord[];
  copyIdOnly: boolean;
}> = ({ records, copyIdOnly }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {records.map((record, idx) => (
      <ClickableRecordCard
        key={record.id ?? record.key ?? idx}
        record={record}
        copyIdOnly={copyIdOnly}
      />
    ))}
  </div>
);

const ClickableRecordCard: React.FC<{
  record: DatabaseRecord;
  copyIdOnly: boolean;
}> = ({ record, copyIdOnly }) => {
  const [copied, setCopied] = useState(false);

  const handleCardClick = () => {
    let textToCopy = "";

    if (copyIdOnly) {
      textToCopy =
        record.id !== undefined ? String(record.id) : (record.key ?? "");
    } else {
      textToCopy = JSON.stringify(record, null, 2);
    }

    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      onClick={handleCardClick}
      title={copyIdOnly ? "Click to copy ID" : "Click to copy JSON object"}
      className={`relative group bg-slate-900/80 border rounded-xl p-4 space-y-3 transition-all cursor-pointer select-none ${
        copied
          ? "border-emerald-500/80 bg-emerald-950/20 shadow-lg shadow-emerald-500/10"
          : "border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-lg hover:shadow-blue-500/5"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        {record.id !== undefined && (
          <span className="inline-flex items-center space-x-1 text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md">
            <Hash className="w-3 h-3" />
            <span>ID: {String(record.id)}</span>
          </span>
        )}
        {record.key && (
          <span className="inline-flex items-center space-x-1 text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md">
            <Tag className="w-3 h-3" />
            <span>KEY: {record.key}</span>
          </span>
        )}
      </div>

      <div className="space-y-1.5 font-mono text-xs">
        {Object.entries(record)
          .filter(([k]) => k !== "id" && k !== "key")
          .map(([key, val]) => (
            <div
              key={key}
              className="flex justify-between items-start gap-4 py-1 border-b border-slate-800/40 last:border-0"
            >
              <span className="text-slate-500 shrink-0">{key}:</span>
              <span className="text-slate-300 text-right font-medium break-all group-hover:text-slate-100 transition-colors">
                {typeof val === "object"
                  ? JSON.stringify(val)
                  : String(val ?? "-")}
              </span>
            </div>
          ))}
      </div>

      {copied && (
        <span className="absolute bottom-3 right-3 inline-flex items-center space-x-1 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow-md animate-fade-in">
          <Check className="w-3 h-3" />
          <span>{copyIdOnly ? "ID copied!" : "JSON copied!"}</span>
        </span>
      )}
    </div>
  );
};

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="py-12 text-center text-slate-500 text-sm font-mono">
    {text}
  </div>
);
