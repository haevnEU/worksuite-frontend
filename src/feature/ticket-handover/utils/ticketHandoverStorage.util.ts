import type {
  ArchivedTicketHandover,
  TicketHandoverState,
} from "../models/ticketHandover.model";

const STORAGE_KEY_HANDOVER = "worktool_ticket_handover_archive";
const STORAGE_KEY_NAMES = "worktool_ticket_handover_names";
const STORAGE_KEY_COMPANIES = "worktool_ticket_handover_companies";
const MAX_ARCHIVE_ITEMS = 10;
const MAX_HISTORY_ITEMS = 10;

export const loadTicketHandoverArchive = (): ArchivedTicketHandover[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HANDOVER);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveTicketHandoverToArchive = (
  state: TicketHandoverState,
): ArchivedTicketHandover[] => {
  const ticketId = state.ticketId.trim();
  if (!ticketId) return loadTicketHandoverArchive();
  const currentArchive = loadTicketHandoverArchive();
  const newItem: ArchivedTicketHandover = {
    ...state,
    ticketId,
    savedAt: new Date().toISOString(),
  };
  const filtered = currentArchive.filter(
    (item) => item.ticketId.toLowerCase() !== ticketId.toLowerCase(),
  );
  const updatedArchive = [newItem, ...filtered].slice(0, MAX_ARCHIVE_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY_HANDOVER, JSON.stringify(updatedArchive));
  } catch {
    // Quota fallback
  }
  return updatedArchive;
};

export const deleteTicketHandoverFromArchive = (
  ticketId: string,
): ArchivedTicketHandover[] => {
  const currentArchive = loadTicketHandoverArchive();
  const updated = currentArchive.filter(
    (item) => item.ticketId.toLowerCase() !== ticketId.toLowerCase(),
  );
  try {
    localStorage.setItem(STORAGE_KEY_HANDOVER, JSON.stringify(updated));
  } catch {
    // Quota fallback
  }
  return updated;
};

// --- Recipient Name & Company History (max 10) ---

export const loadRecentNames = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NAMES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRecentName = (name: string): string[] => {
  const trimmed = name.trim();
  if (!trimmed) return loadRecentNames();
  const current = loadRecentNames().filter(
    (n) => n.toLowerCase() !== trimmed.toLowerCase(),
  );
  const updated = [trimmed, ...current].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY_NAMES, JSON.stringify(updated));
  } catch {
    // Quota fallback
  }
  return updated;
};

export const loadRecentCompanies = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPANIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRecentCompany = (company: string): string[] => {
  const trimmed = company.trim();
  if (!trimmed) return loadRecentCompanies();
  const current = loadRecentCompanies().filter(
    (c) => c.toLowerCase() !== trimmed.toLowerCase(),
  );
  const updated = [trimmed, ...current].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(updated));
  } catch {
    // Quota fallback
  }
  return updated;
};
