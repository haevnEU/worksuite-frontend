export interface ReviewChecklistState {
  styleguide: boolean;
  itestsPassed: boolean;
  itestsOverridden: boolean;
  itestsOverrideReason: string;
  unitTestsPresent: boolean;
  acceptanceCriteriaFound: boolean;
  acceptanceCriteriaVerified: boolean;
  documentationPresent: boolean;
  modernLanguageFeatures: boolean;
  noOverEngineering: boolean;
  noHardcodedSecrets: boolean;
  noDeadCodeOrDebug: boolean;
  resourceLeakHygiene: boolean;
}

export interface ReviewState {
  ticketId: string;
  checklist: ReviewChecklistState;
  positiveFeedback: string[];
  negativeFeedback: string[];
  blockers: string[];
  isTentativeApproval: boolean;
}

export interface ArchivedReview extends ReviewState {
  savedAt: string;
}
