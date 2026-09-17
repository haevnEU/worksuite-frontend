export type HandoverScenario = "to-review" | "back-to-dev" | "to-qa";

export interface ManualQaStep {
  id: string;
  action: string;
  expected?: string;
}

export interface TicketHandoverState {
  ticketId: string;
  scenario: HandoverScenario;
  recipientName: string;
  recipientCompany: string;

  hintsCount: number;
  criticalHintsCount: number;
  pipelinePassed: boolean;
  isApprovalGranted: boolean;

  qaSummary: string;
  qaUnitTests: string[];
  qaManualSteps: ManualQaStep[];
  qaTestFiles: string[];
  qaPipelinePassed: boolean;
  qaPipelineOverridden: boolean;
  qaPipelineOverrideReason: string;
}

export interface ArchivedTicketHandover extends TicketHandoverState {
  savedAt: string;
}
