import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TimeDTO } from "../models/timeEntry.model.ts";
import { timeService } from "../services/network/time.service.ts";

interface TimeTotal {
  hours: number;
  minutes: number;
}

interface TimeContextType {
  entries: TimeDTO[];
  todayTotal: TimeTotal;
  fetchTimeEntries: () => Promise<void>;
  isLoading: boolean;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

// Helper: Berechnet die Gesamtsumme absolut aus einer Liste (ohne Abhängigkeit von altem State)
const calculateTotalTime = (entriesList: TimeDTO[]): TimeTotal => {
  let totalMinutes = 0;

  for (const entry of entriesList) {
    totalMinutes +=
      (Number(entry.hours) || 0) * 60 + (Number(entry.minutes) || 0);
  }

  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
};

export const TimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<TimeDTO[]>([]);
  const [todayTotal, setTodayTotal] = useState<TimeTotal>({
    hours: 0,
    minutes: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTimeEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await timeService.fetch();
      const rawEntries = Array.isArray(data) ? data : [];
      const uniqueEntries = Array.from(
        new Map(rawEntries.map((item) => [item.id, item])).values(),
      );
      setEntries(uniqueEntries);
      const computedTotal = calculateTotalTime(uniqueEntries);
      setTodayTotal(computedTotal);
    } catch (error) {
      console.error("Error fetching time entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimeEntries();
  }, [fetchTimeEntries]);

  const value = useMemo(
    () => ({
      entries,
      todayTotal,
      fetchTimeEntries,
      isLoading,
    }),
    [entries, todayTotal, fetchTimeEntries, isLoading],
  );

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

export const useTime = (): TimeContextType => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error("useTime must be used within a TimeProvider");
  }
  return context;
};
