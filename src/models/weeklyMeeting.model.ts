export interface DaySummaryDTO {
  id?: string;
  date: string;
  summary?: string;
  tasks: string[];
  createdAt?: string;
}

export interface WeeklyMeetingDTO {
  id: string;
  title: string;
  summary?: string;
  daySummaries: DaySummaryDTO[];
  createdAt: string;
}
