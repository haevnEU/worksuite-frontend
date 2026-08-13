import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { UserModel } from "../models/user.model.ts";
import { settingsService } from "../services/network/settings.service.ts";
import { DaysRange } from "../types/kpi.type.ts";
import {
  STORAGE_KEY_IS_DRAFT,
  STORAGE_KEY_KPI_CHART_TYPE,
  STORAGE_KEY_KPI_DAYS_RANGE,
  STORAGE_KEY_KPI_SETTINGS,
} from "../constants/settings.constant.ts";

import { ChartType } from "../types/settings.type.ts";
import { KpiSettings } from "../models/settings.model.ts";
import { useAuth } from "./AuthContext.tsx";

interface SettingsContextType {
  user: UserModel;
  isDraft: boolean;
  setIsDraft: (isDraft: boolean) => void;
  setSelectedUser: (user: UserModel) => void;
  updateVcsKey: (key: string) => Promise<void>;
  updateRedmineKey: (key: string) => Promise<void>;
  hasVcsKey: boolean;
  hasRedmineKey: boolean;
  updateAvatar: (file: File) => Promise<void>;
  getAvatarUrl: () => string | undefined;
  enabledKpis: KpiSettings;
  enableKpi: (key: string) => Promise<void>;
  setAllKpis: (value: boolean) => void;
  daysRange: DaysRange;
  setDaysRange: (value: DaysRange) => void;
  chartType: ChartType;
  setChartType: (value: ChartType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user: authUser } = useAuth();

  const currentUser: UserModel = authUser || {
    id: "",
    firstName: "",
    lastName: "",
    role: "DEVELOPER",
    createdAt: "",
  };

  const [daysRange, setDaysRangeState] = useState<DaysRange>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_KPI_DAYS_RANGE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed === 7 || parsed === 14 || parsed === 21) {
          return parsed as DaysRange;
        }
      } catch (e) {
        console.error("Failed to parse KPI days range from localStorage:", e);
      }
    }
    return 7;
  });

  const setDaysRange = useCallback((value: DaysRange) => {
    setDaysRangeState(value);
    localStorage.setItem(STORAGE_KEY_KPI_DAYS_RANGE, JSON.stringify(value));
  }, []);

  const [chartType, setChartTypeState] = useState<ChartType>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_KPI_CHART_TYPE);
    if (saved === "bar" || saved === "line" || saved === "both") {
      return saved;
    }
    return "both";
  });

  const setChartType = useCallback((value: ChartType) => {
    setChartTypeState(value);
    localStorage.setItem(STORAGE_KEY_KPI_CHART_TYPE, value);
  }, []);

  const [enabledKpis, setEnabledKpis] = useState<KpiSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_KPI_SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse KPI settings from localStorage:", e);
      }
    }
    return {
      spentHours: true,
      movedQa: true,
      fromQa: true,
      movedReview: true,
      fromReview: true,
    };
  });

  const [isDraft, setIsDraftState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_IS_DRAFT);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const setIsDraft = useCallback((value: boolean) => {
    setIsDraftState(value);
    localStorage.setItem(STORAGE_KEY_IS_DRAFT, JSON.stringify(value));
  }, []);

  const setSelectedUser = useCallback((userToSelect: UserModel) => {
    console.log("[SettingsContext] setSelectedUser called with:", userToSelect);
  }, []);

  const [hasVcsKey, setHasVcsKey] = useState<boolean>(
    !!currentUser.vcsKey && currentUser.vcsKey !== "",
  );

  const [hasRedmineKey, setHasRedmineKey] = useState<boolean>(
    !!currentUser.redmineKey && currentUser.redmineKey !== "",
  );

  const updateVcsKey = useCallback(
    async (key: string) => {
      await settingsService.setVcsKey(currentUser, key);
      setHasVcsKey(true);
    },
    [currentUser],
  );

  const updateRedmineKey = useCallback(
    async (key: string) => {
      await settingsService.setRedmineKey(currentUser, key);
      setHasRedmineKey(true);
    },
    [currentUser],
  );

  const updateAvatar = useCallback(
    async (file: File) => {
      await settingsService.setAvatar(currentUser, file);
    },
    [currentUser],
  );

  const getAvatarUrl = useCallback((): string | undefined => {
    const avatarUrl = currentUser.avatarUrl || undefined;
    if (!avatarUrl) {
      return undefined;
    }
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
      return avatarUrl;
    }
    const host = window.location.hostname;
    return `http://${host}/api/v1/settings/users/${currentUser.id}/avatar`;
  }, [currentUser.avatarUrl, currentUser.id]);

  const enableKpi = useCallback(async (key: string) => {
    setEnabledKpis((prev) => {
      if (key in prev) {
        const updated = {
          ...prev,
          [key as keyof KpiSettings]: !prev[key as keyof KpiSettings],
        };
        localStorage.setItem(STORAGE_KEY_KPI_SETTINGS, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  const setAllKpis = useCallback((value: boolean) => {
    const updated: KpiSettings = {
      spentHours: value,
      movedQa: value,
      fromQa: value,
      movedReview: value,
      fromReview: value,
    };
    setEnabledKpis(updated);
    localStorage.setItem(STORAGE_KEY_KPI_SETTINGS, JSON.stringify(updated));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        user: currentUser,
        isDraft,
        setIsDraft,
        setSelectedUser,
        updateVcsKey,
        updateRedmineKey,
        hasVcsKey,
        hasRedmineKey,
        updateAvatar,
        getAvatarUrl,
        enabledKpis,
        enableKpi,
        setAllKpis,
        daysRange,
        setDaysRange,
        chartType,
        setChartType,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
