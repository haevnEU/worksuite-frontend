import { useCallback, useEffect, useState } from "react";
import type {
  ArchivedMrCreator,
  MrCreatorState,
} from "../models/mrCreator.model";
import {
  deleteMrCreatorFromArchive,
  loadMrCreatorArchive,
  saveMrCreatorToArchive,
} from "../utils/mrCreatorStorage.util";

export function useMrCreatorArchive() {
  const [archive, setArchive] = useState<ArchivedMrCreator[]>([]);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    setArchive(loadMrCreatorArchive());
  }, []);

  const saveCreator = useCallback((state: MrCreatorState): boolean => {
    if (!state.ticketId.trim()) return false;
    const updated = saveMrCreatorToArchive(state);
    setArchive(updated);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
    return true;
  }, []);

  const deleteCreator = useCallback((ticketId: string) => {
    const updated = deleteMrCreatorFromArchive(ticketId);
    setArchive(updated);
  }, []);

  return {
    archive,
    showSaveToast,
    saveCreator,
    deleteCreator,
  };
}
