import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ArchivedTicketHandover,
  HandoverScenario,
  ManualQaStep,
  TicketHandoverState,
} from "../models/ticketHandover.model";
import { generateTicketHandoverTextile } from "../utils/ticketHandoverTemplate.util";
import {
  loadRecentCompanies,
  loadRecentNames,
  saveRecentCompany,
  saveRecentName,
} from "../utils/ticketHandoverStorage.util";

export const INITIAL_HANDOVER_STATE: TicketHandoverState = {
  ticketId: "",
  scenario: "to-qa",
  recipientName: "",
  recipientCompany: "",
  hintsCount: 0,
  criticalHintsCount: 0,
  pipelinePassed: true,
  isApprovalGranted: true,

  // To QA defaults
  qaSummary: "",
  qaUnitTests: [],
  qaManualSteps: [],
  qaTestFiles: [],
  qaPipelinePassed: true,
  qaPipelineOverridden: false,
  qaPipelineOverrideReason: "",
};

export function useTicketHandover() {
  const [state, setState] = useState<TicketHandoverState>(
    INITIAL_HANDOVER_STATE,
  );
  const [recentNames, setRecentNames] = useState<string[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<string[]>([]);

  useEffect(() => {
    setRecentNames(loadRecentNames());
    setRecentCompanies(loadRecentCompanies());
  }, []);

  const generatedTextile = useMemo(() => {
    return generateTicketHandoverTextile(state);
  }, [state]);

  const updateField = useCallback(
    <K extends keyof TicketHandoverState>(
      field: K,
      value: TicketHandoverState[K],
    ) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const commitRecipientHistory = useCallback(() => {
    if (state.recipientName.trim()) {
      setRecentNames(saveRecentName(state.recipientName));
    }
    if (state.recipientCompany.trim()) {
      setRecentCompanies(saveRecentCompany(state.recipientCompany));
    }
  }, [state.recipientName, state.recipientCompany]);

  // QA Unit Tests
  const addQaUnitTest = useCallback((testClass: string) => {
    setState((prev) => ({
      ...prev,
      qaUnitTests: [...prev.qaUnitTests, testClass],
    }));
  }, []);

  const removeQaUnitTest = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      qaUnitTests: prev.qaUnitTests.filter((_, i) => i !== index),
    }));
  }, []);

  // QA Manual Steps
  const addQaManualStep = useCallback((step: ManualQaStep) => {
    setState((prev) => ({
      ...prev,
      qaManualSteps: [...prev.qaManualSteps, step],
    }));
  }, []);

  const removeQaManualStep = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      qaManualSteps: prev.qaManualSteps.filter((s) => s.id !== id),
    }));
  }, []);

  // QA Test Files
  const addQaTestFile = useCallback((file: string) => {
    setState((prev) => ({
      ...prev,
      qaTestFiles: [...prev.qaTestFiles, file],
    }));
  }, []);

  const removeQaTestFile = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      qaTestFiles: prev.qaTestFiles.filter((_, i) => i !== index),
    }));
  }, []);

  const setScenario = useCallback((scenario: HandoverScenario) => {
    setState((prev) => ({ ...prev, scenario }));
  }, []);

  const loadFromArchive = useCallback((archived: ArchivedTicketHandover) => {
    const { savedAt: _, ...handoverState } = archived;
    setState(handoverState);
  }, []);

  const resetHandover = useCallback(() => {
    setState(INITIAL_HANDOVER_STATE);
  }, []);

  return {
    state,
    generatedTextile,
    recentNames,
    recentCompanies,
    updateField,
    commitRecipientHistory,
    addQaUnitTest,
    removeQaUnitTest,
    addQaManualStep,
    removeQaManualStep,
    addQaTestFile,
    removeQaTestFile,
    setScenario,
    loadFromArchive,
    resetHandover,
  };
}
