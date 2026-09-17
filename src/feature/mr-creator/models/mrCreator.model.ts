export type MrType = "Feature" | "Bugfix" | "Refactoring" | "Support";

export type MrProject =
  "WMT" | "WMT-Backend" | "WMT-Mobile" | "ERP-Tool" | "Other";

export interface AcceptanceCriterion {
  id: string;
  text: string;
  completed: boolean;
}

export interface ManualTestStep {
  id: string;
  step: string;
  action: string;
  expected: string;
}

export interface MrCreatorState {
  ticketId: string;
  shortTitle: string;
  type: MrType;
  project: MrProject;
  summary: string;

  architectureRefactoring: string;
  affectedComponents: string[];
  breakingChanges: string[];

  acceptanceCriteria: AcceptanceCriterion[];
  unitTestsChecked: boolean;
  unitTestClasses: string[];
  itestsChecked: boolean;
  itestsDetails: string;
  manualTestSteps: ManualTestStep[];
  testFiles: string[];

  hasConfigChanges: boolean;
  configChanges: string;
  hasDatabaseNotes: boolean;
  databaseNotes: string;
  hasRolloutNotes: boolean;
  rolloutNotes: string;
}

export interface ArchivedMrCreator extends MrCreatorState {
  savedAt: string;
}
