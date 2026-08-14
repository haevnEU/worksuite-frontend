import React from "react";
import { Settings2 } from "lucide-react";
import { ValidationSchema } from "../../models/validationSchema.model.ts";

interface SchemaMetaCardProps {
  schema: ValidationSchema;
  onChange: (field: keyof ValidationSchema, value: any) => void;
}

export const SchemaMetaCard: React.FC<SchemaMetaCardProps> = ({
  schema,
  onChange,
}) => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Settings2 className="w-4 h-4 text-blue-400" />
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">
          Schema Metadata & Identifiers
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Readable Name
          </label>
          <input
            type="text"
            value={schema.readableName}
            onChange={(e) => onChange("readableName", e.target.value)}
            placeholder="e.g. Smart-Meter Restanten"
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 transition font-sans"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Schema Name
          </label>
          <input
            type="text"
            value={schema.schemaName}
            onChange={(e) => onChange("schemaName", e.target.value)}
            placeholder="e.g. SMLeftover"
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Header Identifier
          </label>
          <input
            type="text"
            value={schema.headerIdentifier}
            onChange={(e) => onChange("headerIdentifier", e.target.value)}
            placeholder="e.g. MELO"
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            ID Column Index
          </label>
          <input
            type="number"
            min={0}
            value={schema.idColumn}
            onChange={(e) => onChange("idColumn", Number(e.target.value))}
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            ID Name
          </label>
          <input
            type="text"
            value={schema.idName}
            onChange={(e) => onChange("idName", e.target.value)}
            placeholder="e.g. MELO"
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>
    </div>
  );
};
