import { useCallback, useEffect, useState } from "react";
import type {
  ArchivedTicketHandover,
  TicketHandoverState,
} from "../models/ticketHandover.model";
import {
  deleteTicketHandoverFromArchive,
  loadTicketHandoverArchive,
  saveTicketHandoverToArchive,
} from "../utils/ticketHandoverStorage.util";

export function useTicketHandoverArchive() {
  const [archive, setArchive] = useState<ArchivedTicketHandover[]>([]);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    setArchive(loadTicketHandoverArchive());
  }, []);

  const saveHandover = useCallback((state: TicketHandoverState): boolean => {
    if (!state.ticketId.trim()) return false;
    const updated = saveTicketHandoverToArchive(state);
    setArchive(updated);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
    return true;
  }, []);

  const deleteHandover = useCallback((ticketId: string) => {
    const updated = deleteTicketHandoverFromArchive(ticketId);
    setArchive(updated);
  }, []);

  return {
    archive,
    showSaveToast,
    saveHandover,
    deleteHandover,
  };
}
