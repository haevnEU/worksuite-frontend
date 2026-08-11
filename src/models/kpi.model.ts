export interface KpiModel {
  movedToQA: number;
  movedToReview: number;
  returnFromQA: number;
  returnFromReview: number;
  hoursSpent: number;
  day: string;
  id?: string;
}
