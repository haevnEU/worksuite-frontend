import type {
  ArchivedMrCreator,
  MrCreatorState,
} from "../models/mrCreator.model";

const STORAGE_KEY_CREATOR = "worktool_mr_creator_archive";
const MAX_ARCHIVE_ITEMS = 10;

export const loadMrCreatorArchive = (): ArchivedMrCreator[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREATOR);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveMrCreatorToArchive = (
  state: MrCreatorState,
): ArchivedMrCreator[] => {
  const ticketId = state.ticketId.trim();
  if (!ticketId) return loadMrCreatorArchive();
  const currentArchive = loadMrCreatorArchive();
  const newItem: ArchivedMrCreator = {
    ...state,
    ticketId,
    savedAt: new Date().toISOString(),
  };
  const filtered = currentArchive.filter(
    (item) => item.ticketId.toLowerCase() !== ticketId.toLowerCase(),
  );
  const updatedArchive = [newItem, ...filtered].slice(0, MAX_ARCHIVE_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY_CREATOR, JSON.stringify(updatedArchive));
  } catch {
    // Quota fallback
  }
  return updatedArchive;
};

export const deleteMrCreatorFromArchive = (
  ticketId: string,
): ArchivedMrCreator[] => {
  const currentArchive = loadMrCreatorArchive();
  const updated = currentArchive.filter(
    (item) => item.ticketId.toLowerCase() !== ticketId.toLowerCase(),
  );
  try {
    localStorage.setItem(STORAGE_KEY_CREATOR, JSON.stringify(updated));
  } catch {
    // Quota fallback
  }
  return updated;
};
