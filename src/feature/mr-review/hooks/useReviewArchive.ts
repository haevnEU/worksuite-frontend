import { useCallback, useEffect, useState } from "react";
import type { ArchivedReview, ReviewState } from "../models/mrReview.model";
import {
  deleteReviewFromArchive,
  loadReviewArchive,
  saveReviewToArchive,
} from "../utils/reviewStorage.util";

export function useReviewArchive() {
  const [archive, setArchive] = useState<ArchivedReview[]>([]);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    setArchive(loadReviewArchive());
  }, []);

  const saveReview = useCallback((state: ReviewState): boolean => {
    if (!state.ticketId.trim()) return false;

    const updated = saveReviewToArchive(state);
    setArchive(updated);
    setShowSaveToast(true);

    setTimeout(() => setShowSaveToast(false), 2000);
    return true;
  }, []);

  const deleteReview = useCallback((ticketId: string) => {
    const updated = deleteReviewFromArchive(ticketId);
    setArchive(updated);
  }, []);

  return {
    archive,
    showSaveToast,
    saveReview,
    deleteReview,
  };
}
