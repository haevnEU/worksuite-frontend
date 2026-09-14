import React from "react";
import { FolderCode, Settings2 } from "lucide-react";
import type { IdeConfig, IdeTarget } from "../models/stacktrace.model";
import { Modal } from "../../../shared/components/Modal.tsx";
import { HistoryDropdownInput } from "../../../shared/components/HistoryDropdownInput.tsx";

interface IdeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: IdeConfig;
  onUpdateConfig: (updates: Partial<IdeConfig>) => void;
  pathHistory: string[];
  onSavePathToHistory: (path: string) => void;
  onClearPathHistory: () => void;
}

export const IdeSettingsModal: React.FC<IdeSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  pathHistory,
  onSavePathToHistory,
  onClearPathHistory,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={<Settings2 className="w-4 h-4" />}
      title="IDE Deep-Linking & Source Roots"
      subtitle="Auto-appends /src/main/java if omitted"
      maxWidthClass="max-w-xl"
    >
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-semibold">
            Target Editor
          </label>
          <select
            value={config.target}
            onChange={(e) =>
              onUpdateConfig({ target: e.target.value as IdeTarget })
            }
            className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="idea">IntelliJ IDEA (idea://)</option>
            <option value="vscode">VS Code (vscode://)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-semibold">
            Project Base Path
          </label>
          <HistoryDropdownInput
            value={config.projectBasePath}
            onChange={(val) => onUpdateConfig({ projectBasePath: val })}
            onSelectHistory={(val) => {
              onUpdateConfig({ projectBasePath: val });
              onSavePathToHistory(val);
            }}
            onClearHistory={onClearPathHistory}
            history={pathHistory}
            placeholder="e.g. /home/user/workspace/app or C:\workspace\app"
            historyTitle="Recent Project Roots"
            icon={<FolderCode className="w-4 h-4" />}
            activeColorClass="text-indigo-300 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
