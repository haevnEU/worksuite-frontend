import React, { useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { RedmineTicket } from "../../models/ticket.model";

// TODO Maybe in a extra file
export interface QaProtocolData {
  pipelineSuccess: boolean;
  pipelineFailReason: string;
  rebaseExecuted: boolean;
  intro: string;
  hasAcceptanceCriteria: boolean;
  acceptanceCriteria: string;
  hasTestSetup: boolean;
  testSetup: string;
  hasUnitTests: boolean;
  unitTests: string;
  hasTestDatasets: boolean;
  testDatasets: string;
  hasSideEffects: boolean;
  sideEffects: string;
  hasChangedEndpoints: boolean;
  changedEndpoints: string;
}

const INITIAL_QA_FORM_DATA: QaProtocolData = {
  pipelineSuccess: true,
  pipelineFailReason: "",
  rebaseExecuted: false,
  intro: "",
  hasAcceptanceCriteria: false,
  acceptanceCriteria: "",
  hasTestSetup: false,
  testSetup: "",
  hasUnitTests: false,
  unitTests: "",
  hasTestDatasets: false,
  testDatasets: "",
  hasSideEffects: false,
  sideEffects: "",
  hasChangedEndpoints: false,
  changedEndpoints: "",
};

interface QaProtocolModalProps {
  ticket: RedmineTicket;
  onClose: () => void;
  onSave: (ticketId: number, data: QaProtocolData) => Promise<void>;
}

export const QaProtocolModal: React.FC<QaProtocolModalProps> = ({
  ticket,
  onClose,
  onSave,
}) => {
  const [qaFormData, setQaFormData] =
    useState<QaProtocolData>(INITIAL_QA_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleField = (
    flagKey: keyof QaProtocolData,
    textKey: keyof QaProtocolData,
    enabled: boolean,
  ) => {
    setQaFormData((prev) => ({
      ...prev,
      [flagKey]: enabled,
      [textKey]: enabled ? prev[textKey] : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(ticket.id, qaFormData);
    setIsSubmitting(false);
  };

  const ENDPOINT_PLACEHOLDER = `Method:
Payload:
Response:
Status:
Description:`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 font-sans text-xs">
      <div className="w-[80vw] h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5 text-white font-extrabold text-base">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2>Create QA Protocol</h2>
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
                Introduction / Overview (Optional)
              </label>
              <textarea
                rows={2}
                value={qaFormData.intro}
                onChange={(e) =>
                  setQaFormData({ ...qaFormData, intro: e.target.value })
                }
                placeholder="Brief introduction or summary of changes..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-800">
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.pipelineSuccess}
                    onChange={(e) =>
                      setQaFormData({
                        ...qaFormData,
                        pipelineSuccess: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Pipeline successful? (y/N)
                  </span>
                </label>

                {!qaFormData.pipelineSuccess && (
                  <div className="pl-7 pt-1 animate-in fade-in duration-200">
                    <label className="block text-[11px] text-rose-400 font-semibold mb-1">
                      Reason for pipeline failure / Notes *
                    </label>
                    <textarea
                      required={!qaFormData.pipelineSuccess}
                      rows={2}
                      value={qaFormData.pipelineFailReason}
                      onChange={(e) =>
                        setQaFormData({
                          ...qaFormData,
                          pipelineFailReason: e.target.value,
                        })
                      }
                      placeholder="Why did the pipeline fail?..."
                      className="w-full bg-slate-950 border border-rose-900/60 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.rebaseExecuted}
                    onChange={(e) =>
                      setQaFormData({
                        ...qaFormData,
                        rebaseExecuted: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Rebase executed? (y/N)
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.hasAcceptanceCriteria}
                    onChange={(e) =>
                      handleToggleField(
                        "hasAcceptanceCriteria",
                        "acceptanceCriteria",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Specify Acceptance Criteria
                  </span>
                </label>
                <textarea
                  rows={3}
                  disabled={!qaFormData.hasAcceptanceCriteria}
                  value={qaFormData.acceptanceCriteria}
                  onChange={(e) =>
                    setQaFormData({
                      ...qaFormData,
                      acceptanceCriteria: e.target.value,
                    })
                  }
                  placeholder={
                    qaFormData.hasAcceptanceCriteria
                      ? "Describe fulfilled acceptance criteria..."
                      : "Disabled (check box to edit)"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.hasTestSetup}
                    onChange={(e) =>
                      handleToggleField(
                        "hasTestSetup",
                        "testSetup",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Specify Test Setup
                  </span>
                </label>
                <textarea
                  rows={3}
                  disabled={!qaFormData.hasTestSetup}
                  value={qaFormData.testSetup}
                  onChange={(e) =>
                    setQaFormData({ ...qaFormData, testSetup: e.target.value })
                  }
                  placeholder={
                    qaFormData.hasTestSetup
                      ? "Steps to set up test environment..."
                      : "Disabled (check box to edit)"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.hasUnitTests}
                    onChange={(e) =>
                      handleToggleField(
                        "hasUnitTests",
                        "unitTests",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Unit Tests Present
                  </span>
                </label>
                <textarea
                  rows={3}
                  disabled={!qaFormData.hasUnitTests}
                  value={qaFormData.unitTests}
                  onChange={(e) =>
                    setQaFormData({ ...qaFormData, unitTests: e.target.value })
                  }
                  placeholder={
                    qaFormData.hasUnitTests
                      ? "Overview / coverage of unit tests..."
                      : "Disabled (check box to edit)"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.hasTestDatasets}
                    onChange={(e) =>
                      handleToggleField(
                        "hasTestDatasets",
                        "testDatasets",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Test Datasets Present
                  </span>
                </label>
                <textarea
                  rows={3}
                  disabled={!qaFormData.hasTestDatasets}
                  value={qaFormData.testDatasets}
                  onChange={(e) =>
                    setQaFormData({
                      ...qaFormData,
                      testDatasets: e.target.value,
                    })
                  }
                  placeholder={
                    qaFormData.hasTestDatasets
                      ? "Filename | Description"
                      : "Disabled (check box to edit)"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.hasSideEffects}
                    onChange={(e) =>
                      handleToggleField(
                        "hasSideEffects",
                        "sideEffects",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Specify Possible Side Effects
                  </span>
                </label>
                <textarea
                  rows={4}
                  disabled={!qaFormData.hasSideEffects}
                  value={qaFormData.sideEffects}
                  onChange={(e) =>
                    setQaFormData({
                      ...qaFormData,
                      sideEffects: e.target.value,
                    })
                  }
                  placeholder={
                    qaFormData.hasSideEffects
                      ? "Possible side effects on other systems/modules..."
                      : "Disabled (check box to edit)"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qaFormData.hasChangedEndpoints}
                    onChange={(e) =>
                      handleToggleField(
                        "hasChangedEndpoints",
                        "changedEndpoints",
                        e.target.checked,
                      )
                    }
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-200">
                    Specify Changed RESTful Endpoints
                  </span>
                </label>
                <textarea
                  rows={4}
                  disabled={!qaFormData.hasChangedEndpoints}
                  value={qaFormData.changedEndpoints}
                  onChange={(e) =>
                    setQaFormData({
                      ...qaFormData,
                      changedEndpoints: e.target.value,
                    })
                  }
                  placeholder={
                    qaFormData.hasChangedEndpoints
                      ? ENDPOINT_PLACEHOLDER
                      : "Disabled (check box to edit)"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                />
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
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isSubmitting ? "Saving..." : "Save Protocol & Move to QA"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
