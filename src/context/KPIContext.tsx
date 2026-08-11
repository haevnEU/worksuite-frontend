import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
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
  const { daysRange } = useSettings();
  const [data, setData] = useState<KpiModel[]>([]);

  useEffect(() => {
    refresh();
  }, [daysRange]);

  const refresh = async () => {
    const data = await kpiService.fetch(daysRange);
    setData(data);
  };

  return (
    <KPIContext.Provider value={{ data, refresh }}>
      {children}
    </KPIContext.Provider>
  );
};

export const useKPI = (): KPIContextType => {
  const context = useContext(KPIContext);
  if (!context) {
    throw new Error("useKPI must be used within a KPIProvider");
  }
  return context;
};
