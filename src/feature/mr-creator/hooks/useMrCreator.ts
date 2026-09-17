import { useCallback, useMemo, useState } from "react";
import type {
  AcceptanceCriterion,
  ArchivedMrCreator,
  ManualTestStep,
  MrCreatorState,
} from "../models/mrCreator.model";
import { generateMrCreatorMarkdown } from "../utils/mrCreatorTemplate.util";

export const INITIAL_MR_CREATOR_STATE: MrCreatorState = {
  ticketId: "",
  shortTitle: "",
  type: "Feature",
  project: "WMT",
  summary: "",
  architectureRefactoring: "",
  affectedComponents: [],
  breakingChanges: [],
  acceptanceCriteria: [],
  unitTestsChecked: true,
  unitTestClasses: [],
  itestsChecked: true,
  itestsDetails: "Wurde übersprungen (Flakiness)",
  manualTestSteps: [],
  testFiles: [],
  hasConfigChanges: false,
  configChanges: "",
  hasDatabaseNotes: false,
  databaseNotes: "",
  hasRolloutNotes: false,
  rolloutNotes: "",
};

export function useMrCreator() {
  const [state, setState] = useState<MrCreatorState>(INITIAL_MR_CREATOR_STATE);

  const generatedMarkdown = useMemo(() => {
    return generateMrCreatorMarkdown(state);
  }, [state]);

  const updateField = useCallback(
    <K extends keyof MrCreatorState>(field: K, value: MrCreatorState[K]) => {
      setState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const addAcceptanceCriterion = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      acceptanceCriteria: [
        ...prev.acceptanceCriteria,
        { id: crypto.randomUUID(), text, completed: false },
      ],
    }));
  }, []);

  const toggleAcceptanceCriterion = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.map((ak) =>
        ak.id === id ? { ...ak, completed: !ak.completed } : ak,
      ),
    }));
  }, []);

  const removeAcceptanceCriterion = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((ak) => ak.id !== id),
    }));
  }, []);

  const addAffectedComponent = useCallback((component: string) => {
    setState((prev) => ({
      ...prev,
      affectedComponents: [...prev.affectedComponents, component],
    }));
  }, []);

  const removeAffectedComponent = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      affectedComponents: prev.affectedComponents.filter((_, i) => i !== index),
    }));
  }, []);

  const addBreakingChange = useCallback((change: string) => {
    setState((prev) => ({
      ...prev,
      breakingChanges: [...prev.breakingChanges, change],
    }));
  }, []);

  const removeBreakingChange = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      breakingChanges: prev.breakingChanges.filter((_, i) => i !== index),
    }));
  }, []);

  const addUnitTestClass = useCallback((testClass: string) => {
    setState((prev) => ({
      ...prev,
      unitTestClasses: [...prev.unitTestClasses, testClass],
    }));
  }, []);

  const removeUnitTestClass = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      unitTestClasses: prev.unitTestClasses.filter((_, i) => i !== index),
    }));
  }, []);

  const addManualTestStep = useCallback((step: ManualTestStep) => {
    setState((prev) => ({
      ...prev,
      manualTestSteps: [...prev.manualTestSteps, step],
    }));
  }, []);

  const removeManualTestStep = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      manualTestSteps: prev.manualTestSteps.filter((s) => s.id !== id),
    }));
  }, []);

  const addTestFile = useCallback((file: string) => {
    setState((prev) => ({
      ...prev,
      testFiles: [...prev.testFiles, file],
    }));
  }, []);

  const removeTestFile = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      testFiles: prev.testFiles.filter((_, i) => i !== index),
    }));
  }, []);

  const loadFromArchive = useCallback((archived: ArchivedMrCreator) => {
    const { savedAt: _, ...creatorState } = archived;
    setState(creatorState);
  }, []);

  const resetCreator = useCallback(() => {
    setState(INITIAL_MR_CREATOR_STATE);
  }, []);

  return {
    state,
    generatedMarkdown,
    updateField,
    addAcceptanceCriterion,
    toggleAcceptanceCriterion,
    removeAcceptanceCriterion,
    addAffectedComponent,
    removeAffectedComponent,
    addBreakingChange,
    removeBreakingChange,
    addUnitTestClass,
    removeUnitTestClass,
    addManualTestStep,
    removeManualTestStep,
    addTestFile,
    removeTestFile,
    loadFromArchive,
    resetCreator,
  };
}
