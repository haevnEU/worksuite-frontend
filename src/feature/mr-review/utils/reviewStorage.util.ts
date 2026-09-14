import type { ArchivedReview, ReviewState } from "../models/mrReview.model";

const STORAGE_KEY_REVIEWS = "worktool_mr_review_archive";
const MAX_ARCHIVE_ITEMS = 10;

export const loadReviewArchive = (): ArchivedReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveReviewToArchive = (state: ReviewState): ArchivedReview[] => {
  const ticketId = state.ticketId.trim();
  if (!ticketId) return loadReviewArchive();

  const currentArchive = loadReviewArchive();
  const newItem: ArchivedReview = {
    ...state,
    ticketId,
    savedAt: new Date().toISOString(),
  };

  const filtered = currentArchive.filter(
    (item) => item.ticketId.toLowerCase() !== ticketId.toLowerCase(),
  );

  const updatedArchive = [newItem, ...filtered].slice(0, MAX_ARCHIVE_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updatedArchive));
  } catch {
    // Quota fallback
  }

  return updatedArchive;
};

export const deleteReviewFromArchive = (ticketId: string): ArchivedReview[] => {
  const currentArchive = loadReviewArchive();
  const updated = currentArchive.filter(
    (item) => item.ticketId.toLowerCase() !== ticketId.toLowerCase(),
  );

  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
  } catch {
    // Quota fallback
  }

  return updated;
};
