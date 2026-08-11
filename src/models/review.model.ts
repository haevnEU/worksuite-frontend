import { ReviewType } from "../types/review.type";

export interface ReviewModel {
  id: string;
  ticketNumber: string;
  ticketUrl?: string;
  title: string;
  description: string;
  type: ReviewType;
  demoNotes?: string;
  keyFacts?: string[];
  isArchived: boolean;
  createdAt: string;
}

export interface CreateReviewRequest {
  ticketNumber: string;
  title: string;
  description?: string;
  type: "DEMO" | "PRESENTATION";
  demoNotes?: string;
  keyFacts?: string[];
}
