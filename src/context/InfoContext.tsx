import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { InfoRecord, RedmineInfoMap } from "../models/info.model.ts";
import { infoService } from "../services/network/info.service.ts";
import { useSettings } from "./SettingsContext.tsx";

interface InfoContextType {
  redmineStatus: InfoRecord[];
  redminePriority: InfoRecord[];
  redmineActivity: InfoRecord[];
  fetchInfo: () => Promise<void>;
}

const InfoContext = createContext<InfoContextType | undefined>(undefined);

export const InfoProvider: React.FC<{ children: ReactNode }> = ({
                                                                  children,
                                                                }) => {
  const { hasRedmineKey } = useSettings();
  const [redmineStatus, setRedmineStatus] = useState<InfoRecord[]>([]);
  const [redminePriority, setRedminePriority] = useState<InfoRecord[]>([]);
  const [redmineActivity, setRedmineActivity] = useState<InfoRecord[]>([]);

  const fetchInfo = useCallback(async () => {
    // 🛑 Guard: Nicht abfragen, wenn kein Redmine Key existiert
    if (!hasRedmineKey) {
      setRedminePriority([]);
      setRedmineStatus([]);
      setRedmineActivity([]);
      return;
    }

    try {
      const redmineData: RedmineInfoMap = await infoService.fetchRedmineMeta();
      setRedminePriority(redmineData.priority || []);
      setRedmineStatus(redmineData.status || []);
      setRedmineActivity(redmineData.activity || []);
    } catch (error) {
      console.error("Failed to fetch Redmine metadata:", error);
    }
  }, [hasRedmineKey]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const contextValue = useMemo<InfoContextType>(
      () => ({
        redmineStatus,
        redminePriority,
        redmineActivity,
        fetchInfo,
      }),
      [redmineStatus, redminePriority, redmineActivity, fetchInfo],
  );

  return (
      <InfoContext.Provider value={contextValue}>{children}</InfoContext.Provider>
  );
};

export const useInfo = (): InfoContextType => {
  const context = useContext(InfoContext);
  if (!context) {
    throw new Error("useInfo must be used within an InfoProvider");
  }
  return context;
};