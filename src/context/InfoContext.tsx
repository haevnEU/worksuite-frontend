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
  const [redmineStatus, setRedmineStatus] = useState<InfoRecord[]>([]);
  const [redminePriority, setRedminePriority] = useState<InfoRecord[]>([]);
  const [redmineActivity, setRedmineActivity] = useState<InfoRecord[]>([]);

  const fetchInfo = useCallback(async () => {
    const redmineData: RedmineInfoMap = await infoService.fetchRedmineMeta();
    setRedminePriority(redmineData.priority || []);
    setRedmineStatus(redmineData.status || []);
    setRedmineActivity(redmineData.activity || []);
  }, []);

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
