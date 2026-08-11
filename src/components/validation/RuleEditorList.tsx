import React from "react";
import { ArrowDown, ArrowUp, Hash, Trash2 } from "lucide-react";
import { ValidationRuleItem } from "../../models/validationSchema.model.ts";

interface RuleEditorListProps {
  rules: ValidationRuleItem[];
  onChangeRule: (
    id: string,
    field: keyof ValidationRuleItem,
    value: any,
  ) => void;
  onDeleteRule: (id: string) => void;
  onMoveRule: (index: number, direction: "up" | "down") => void;
}

export const RuleEditorList: React.FC<RuleEditorListProps> = ({
  rules,
  onChangeRule,
  onDeleteRule,
  onMoveRule,
}) => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Column Validation Rules ({rules.length} Total)
          </h2>
        </div>
        <span className="text-xs text-slate-400">
          Columns are auto-indexed 0 to {Math.max(0, rules.length - 1)}
        </span>
      </div>

      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div
            key={rule.id}
            className="bg-[#0b111e] border border-slate-800/90 rounded-xl p-4 transition-all hover:border-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 font-mono text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Col #{idx}
                </span>
                <span className="text-xs font-bold text-white">
                  {rule.fieldName || `Unnamed Field ${idx + 1}`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMoveRule(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveRule(idx, "down")}
                  disabled={idx === rules.length - 1}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <button
                  type="button"
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  title="Delete Rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Field Name
                </label>
                <input
                  type="text"
                  value={rule.fieldName}
                  onChange={(e) =>
                    onChangeRule(rule.id, "fieldName", e.target.value)
                  }
                  placeholder="e.g. MeLo"
                  className="w-full bg-[#10192c] border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="sm:col-span-5 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Regex Pattern
                </label>
                <input
                  type="text"
                  value={rule.regex}
                  onChange={(e) =>
                    onChangeRule(rule.id, "regex", e.target.value)
                  }
                  placeholder="e.g. [A-Z]{2}[0-9]{6}..."
                  className="w-full bg-[#10192c] border border-slate-800 text-purple-300 font-mono rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Choice (opt.)
                </label>
                <input
                  type="text"
                  value={rule.choice || ""}
                  onChange={(e) =>
                    onChangeRule(rule.id, "choice", e.target.value)
                  }
                  placeholder="e.g. YES|NO"
                  className="w-full bg-[#10192c] border border-slate-800 text-slate-300 font-mono rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col justify-center items-start sm:items-center space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Optional
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={rule.optional}
                    onChange={(e) =>
                      onChangeRule(rule.id, "optional", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 font-mono">
                    {rule.optional ? "true" : "false"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
