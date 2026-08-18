import React, { useState } from "react";
import { GitPullRequest, X } from "lucide-react";
import { RedmineTicket } from "../../models/ticket.model";
import { useSettings } from "../../context/SettingsContext.tsx";
import { MrProtocolData } from "../../models/vcs.model.ts";

interface MrLinkModalProps {
  ticket: RedmineTicket;
  onClose: () => void;
  onSave: (ticketId: number, data: MrProtocolData) => Promise<void>;
}

export const MrLinkModal: React.FC<MrLinkModalProps> = ({
  ticket,
  onClose,
  onSave,
}) => {
  const { vcsProvider } = useSettings();
  const isGitLab = vcsProvider !== "GITHUB";
  const prLabel = isGitLab ? "Merge Request" : "Pull Request";

  const theme = {
    accentText: isGitLab ? "text-orange-400" : "text-purple-400",
    badgeBg: isGitLab ? "bg-orange-950/80" : "bg-purple-950/80",
    badgeBorder: isGitLab ? "border-orange-800" : "border-purple-800",
    accentCheckbox: isGitLab ? "accent-orange-600" : "accent-purple-600",
    focusRing: isGitLab
      ? "focus:ring-orange-500/20"
      : "focus:ring-purple-500/20",
    submitBtn: isGitLab
      ? "bg-orange-600 hover:bg-orange-500"
      : "bg-purple-600 hover:bg-purple-500",
  };

  const [mrFormData, setMrFormData] = useState<MrProtocolData>({
    title: ticket.subject || "",
    description: "",
    ticketId: `${ticket.id}`,
    hasImportantChanges: false,
    importantChanges: "",
    hasTestSetup: false,
    hasUnitTests: false,
    unitTests: "",
    hasManualTests: false,
    manualTests: "",
    hasBreakingChanges: false,
    hasDatabaseSchemaChanges: false,
    hasDatabaseViewsChanges: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleField = (
    flagKey: keyof MrProtocolData,
    textKey: keyof MrProtocolData,
    enabled: boolean,
  ) => {
    setMrFormData((prev) => ({
      ...prev,
      [flagKey]: enabled,
      [textKey]: enabled ? prev[textKey] : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: MrProtocolData = {
      ...mrFormData,
      title: `[#${ticket.id}] ${mrFormData.title.trim()}`,
    };

    await onSave(ticket.id, payload);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 font-sans text-xs">
      <div className="w-[80vw] h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5 text-white font-extrabold text-base">
            <div
              className={`p-2 rounded-xl ${theme.badgeBg} border ${theme.badgeBorder} ${theme.accentText} transition-colors`}
            >
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h2>Create {prLabel} Description</h2>
              <p className="text-xs text-slate-400 font-normal">
                Ticket #{ticket.id} - {ticket.subject}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
              <label className="block font-bold text-slate-200">
                {prLabel} Title <span className={theme.accentText}>*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`[#${ticket.id}]`}
                  className={`w-24 bg-slate-950/90 border border-slate-700 rounded-xl p-3 ${theme.accentText} font-mono text-center font-bold select-none cursor-not-allowed shrink-0`}
                  title="Ticket Prefix"
                />
                <input
                  type="text"
                  required
                  value={mrFormData.title}
                  onChange={(e) =>
                    setMrFormData({
                      ...mrFormData,
                      title: e.target.value,
                    })
                  }
                  placeholder={`e.g. Implement authentication flow`}
                  className={`flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 ${theme.focusRing}`}
                />
              </div>
            </div>

            <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
              <label className="block font-bold text-slate-200">
                Description
              </label>
              <textarea
                rows={3}
                value={mrFormData.description}
                onChange={(e) =>
                  setMrFormData({
                    ...mrFormData,
                    description: e.target.value,
                  })
                }
                placeholder={`Briefly describe what this ticket / ${prLabel.toLowerCase()} is about...`}
                className={`w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 ${theme.focusRing}`}
              />
            </div>

            <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mrFormData.hasImportantChanges}
                  onChange={(e) =>
                    handleToggleField(
                      "hasImportantChanges",
                      "importantChanges",
                      e.target.checked,
                    )
                  }
                  className={`w-4 h-4 ${theme.accentCheckbox} rounded cursor-pointer`}
                />
                <span className="font-bold text-slate-200">
                  Specify Important Changes
                </span>
              </label>
              <textarea
                rows={3}
                disabled={!mrFormData.hasImportantChanges}
                value={mrFormData.importantChanges}
                onChange={(e) =>
                  setMrFormData({
                    ...mrFormData,
                    importantChanges: e.target.value,
                  })
                }
                placeholder={
                  mrFormData.hasImportantChanges
                    ? `Describe key changes made in this ${prLabel.toLowerCase()}...`
                    : "Disabled (check box to edit)"
                }
                className={`w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 ${theme.focusRing} disabled:opacity-40 disabled:cursor-not-allowed`}
              />
            </div>

            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 text-sm">
                Testing Procedure
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mrFormData.hasUnitTests}
                      onChange={(e) =>
                        handleToggleField(
                          "hasUnitTests",
                          "unitTests",
                          e.target.checked,
                        )
                      }
                      className={`w-4 h-4 ${theme.accentCheckbox} rounded cursor-pointer`}
                    />
                    <span className="font-bold text-slate-200">Unit Tests</span>
                  </label>
                  <textarea
                    rows={3}
                    disabled={!mrFormData.hasUnitTests}
                    value={mrFormData.unitTests}
                    onChange={(e) =>
                      setMrFormData({
                        ...mrFormData,
                        unitTests: e.target.value,
                      })
                    }
                    placeholder={
                      mrFormData.hasUnitTests
                        ? "List all created/updated unit tests..."
                        : "Disabled (check box to edit)"
                    }
                    className={`w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 ${theme.focusRing} disabled:opacity-40 disabled:cursor-not-allowed`}
                  />
                </div>

                <div className="space-y-1.5 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mrFormData.hasManualTests}
                      onChange={(e) =>
                        handleToggleField(
                          "hasManualTests",
                          "manualTests",
                          e.target.checked,
                        )
                      }
                      className={`w-4 h-4 ${theme.accentCheckbox} rounded cursor-pointer`}
                    />
                    <span className="font-bold text-slate-200">
                      Manual Tests
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    disabled={!mrFormData.hasManualTests}
                    value={mrFormData.manualTests}
                    onChange={(e) =>
                      setMrFormData({
                        ...mrFormData,
                        manualTests: e.target.value,
                      })
                    }
                    placeholder={
                      mrFormData.hasManualTests
                        ? "Provide steps for manual verification..."
                        : "Disabled (check box to edit)"
                    }
                    className={`w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 ${theme.focusRing} disabled:opacity-40 disabled:cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 text-sm">
                Notice Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center space-x-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={mrFormData.hasBreakingChanges}
                    onChange={(e) =>
                      setMrFormData({
                        ...mrFormData,
                        hasBreakingChanges: e.target.checked,
                      })
                    }
                    className={`w-4 h-4 ${theme.accentCheckbox} rounded cursor-pointer`}
                  />
                  <span className="font-medium text-slate-300">
                    Breaking changes present
                  </span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={mrFormData.hasDatabaseSchemaChanges}
                    onChange={(e) =>
                      setMrFormData({
                        ...mrFormData,
                        hasDatabaseSchemaChanges: e.target.checked,
                      })
                    }
                    className={`w-4 h-4 ${theme.accentCheckbox} rounded cursor-pointer`}
                  />
                  <span className="font-medium text-slate-300">
                    Database schema adjusted
                  </span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={mrFormData.hasDatabaseViewsChanges}
                    onChange={(e) =>
                      setMrFormData({
                        ...mrFormData,
                        hasDatabaseViewsChanges: e.target.checked,
                      })
                    }
                    className={`w-4 h-4 ${theme.accentCheckbox} rounded cursor-pointer`}
                  />
                  <span className="font-medium text-slate-300">
                    Database Views / Functions / Triggers adjusted
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/90 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 ${theme.submitBtn} text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition-colors disabled:opacity-50`}
            >
              <GitPullRequest className="w-4 h-4" />
              <span>
                {isSubmitting ? "Saving..." : `Save ${prLabel} Description`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
