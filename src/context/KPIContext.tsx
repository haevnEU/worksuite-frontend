import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { kpiService } from "../services/network/kpi.service.ts";
import { useSettings } from "./SettingsContext.tsx";
import { KpiModel } from "../models/kpi.model.ts";

interface KPIContextType {
  data: KpiModel[];
  refresh: () => Promise<void>;
}

const KPIContext = createContext<KPIContextType | undefined>(undefined);

export const KPIProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { daysRange, hasRedmineKey } = useSettings();
  const [data, setData] = useState<KpiModel[]>([]);

  const refresh = useCallback(async () => {
    if (!hasRedmineKey) {
      setData([]);
      return;
    }

    try {
      const result = await kpiService.fetch(daysRange);
      setData(result || []);
    } catch (error) {
      console.error("Failed to fetch KPI data:", error);
    }
  }, [daysRange, hasRedmineKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const contextValue = useMemo<KPIContextType>(
    () => ({
      data,
      refresh,
    }),
    [data, refresh],
  );

  return (
    <KPIContext.Provider value={contextValue}>{children}</KPIContext.Provider>
  );
};

export const useKPI = (): KPIContextType => {
  const context = useContext(KPIContext);
  if (!context) {
    throw new Error("useKPI must be used within a KPIProvider");
  }
  return context;
};
