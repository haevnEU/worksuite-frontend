export interface LogTimePayload {
  day: string;
  hours: number;
  minutes: number;
  activityId: number;
  comment: string;
}

export interface TimeDTO {
  id: string;
  hours: number;
  minutes: number;
  date: string;
  description: string;
  createdAt: string;
  activityId: number;
  ticketId: number;
}
