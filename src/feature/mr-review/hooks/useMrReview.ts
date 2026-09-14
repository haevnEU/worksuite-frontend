import { useCallback, useMemo, useState } from "react";
import type {
  ArchivedReview,
  ReviewChecklistState,
  ReviewState,
} from "../models/mrReview.model";
import { generateMrReviewMarkdown } from "../utils/mrTemplate.util";

const INITIAL_CHECKLIST_STATE: ReviewChecklistState = {
  styleguide: false,
  itestsPassed: false,
  itestsOverridden: false,
  itestsOverrideReason: "",
  unitTestsPresent: false,
  acceptanceCriteriaFound: false,
  acceptanceCriteriaVerified: false,
  documentationPresent: false,
  modernLanguageFeatures: false,
  noOverEngineering: false,
  noHardcodedSecrets: false,
  noDeadCodeOrDebug: false,
  resourceLeakHygiene: false,
};

const INITIAL_REVIEW_STATE: ReviewState = {
  ticketId: "",
  checklist: INITIAL_CHECKLIST_STATE,
  positiveFeedback: [],
  negativeFeedback: [],
  blockers: [],
  isTentativeApproval: false,
};

export function useMrReview() {
  const [state, setState] = useState<ReviewState>(INITIAL_REVIEW_STATE);

  const generatedMarkdown = useMemo(() => {
    return generateMrReviewMarkdown(state);
  }, [state]);

  const setTicketId = useCallback((ticketId: string) => {
    setState((prev) => ({ ...prev, ticketId }));
  }, []);

  const updateChecklist = useCallback(
    (patch: Partial<ReviewChecklistState>) => {
      setState((prev) => ({
        ...prev,
        checklist: { ...prev.checklist, ...patch },
      }));
    },
    [],
  );

  const addPositiveFeedback = useCallback((item: string) => {
    setState((prev) => ({
      ...prev,
      positiveFeedback: [...prev.positiveFeedback, item],
    }));
  }, []);

  const removePositiveFeedback = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      positiveFeedback: prev.positiveFeedback.filter((_, i) => i !== index),
    }));
  }, []);

  const addNegativeFeedback = useCallback((item: string) => {
    setState((prev) => ({
      ...prev,
      negativeFeedback: [...prev.negativeFeedback, item],
    }));
  }, []);

  const removeNegativeFeedback = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      negativeFeedback: prev.negativeFeedback.filter((_, i) => i !== index),
    }));
  }, []);

  const addBlocker = useCallback((item: string) => {
    setState((prev) => ({
      ...prev,
      blockers: [...prev.blockers, item],
    }));
  }, []);

  const removeBlocker = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      blockers: prev.blockers.filter((_, i) => i !== index),
    }));
  }, []);

  const setTentativeApproval = useCallback((isTentativeApproval: boolean) => {
    setState((prev) => ({ ...prev, isTentativeApproval }));
  }, []);

  const loadFromArchive = useCallback((archived: ArchivedReview) => {
    const { savedAt: _, ...reviewState } = archived;
    setState(reviewState);
  }, []);

  const resetReview = useCallback(() => {
    setState(INITIAL_REVIEW_STATE);
  }, []);

  return {
    state,
    generatedMarkdown,
    setTicketId,
    updateChecklist,
    addPositiveFeedback,
    removePositiveFeedback,
    addNegativeFeedback,
    removeNegativeFeedback,
    addBlocker,
    removeBlocker,
    setTentativeApproval,
    loadFromArchive,
    resetReview,
  };
}
