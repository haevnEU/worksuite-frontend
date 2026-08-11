export type TicketStatus =
  | "Neu"
  | "In Bearbeitung"
  | "Gelöst"
  | "Feedback"
  | "Geschlossen"
  | "Abgelehnt"
  | "In Review"
  | "Approved"
  | "On Hold"
  | "Sprint Backlog"
  | string;

export type TicketPriority =
  "Niedrig" | "Normal" | "Hoch" | "Dringend" | "Sofort" | string;

export type TicketTracker =
  "Fehler" | "Feature" | "Unterstützung" | "Aufgabe" | "Refactoring" | string;
