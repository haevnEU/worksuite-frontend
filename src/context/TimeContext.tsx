import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LogTimePayload, TimeDTO } from "../models/timeEntry.model.ts";
import { timeService } from "../services/network/time.service.ts";
import { ticketService } from "../services/network/ticket.service.ts";

interface TodayTotal {
  hours: number;
  minutes: number;
  formatted: string;
}

interface TimeContextType {
  entries: TimeDTO[];
  isLoading: boolean;
  todayTotal: TodayTotal;
  fetchTimeEntries: () => Promise<void>;
  logTime: (ticketId: number, data: LogTimePayload) => Promise<void>;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<TimeDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTimeEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await timeService.fetch();
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch time entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logTime = useCallback(
    async (ticketId: number, data: LogTimePayload) => {
      await ticketService.logTime(ticketId, data);
      await fetchTimeEntries();
    },
    [fetchTimeEntries],
  );

  useEffect(() => {
    fetchTimeEntries();
  }, [fetchTimeEntries]);

  const todayTotal = useMemo<TodayTotal>(() => {
    const todayIso = new Date().toISOString().split("T")[0];

    const todayMinutes = entries.reduce((acc, entry) => {
      if (!entry.date) return acc;
      const entryDateFormatted = new Date(entry.date)
        .toISOString()
        .split("T")[0];

      if (entryDateFormatted === todayIso) {
        return acc + entry.hours * 60 + entry.minutes;
      }
      return acc;
    }, 0);

    const hours = Math.floor(todayMinutes / 60);
    const minutes = todayMinutes % 60;

    return {
      hours,
      minutes,
      formatted: `${hours}h ${minutes}m`,
    };
  }, [entries]);

  const contextValue = useMemo<TimeContextType>(
    () => ({
      entries,
      isLoading,
      todayTotal,
      fetchTimeEntries,
      logTime,
    }),
    [entries, isLoading, todayTotal, fetchTimeEntries, logTime],
  );

  return (
    <TimeContext.Provider value={contextValue}>{children}</TimeContext.Provider>
  );
};

export const useTime = (): TimeContextType => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error("useTime must be used within a TimeProvider");
  }
  return context;
};
