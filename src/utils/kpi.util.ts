import { KpiType } from "../types/kpi.type.ts";
import {
  HOURS_SPENT_BAR_COLOR,
  LOCAL_STORAGE_COLOR_KEY_PREFIX,
  MOVED_TO_QA_BAR_COLOR,
  MOVED_TO_REVIEW_BAR_COLOR,
  RETURN_FROM_QA_BAR_COLOR,
  RETURN_FROM_REVIEW_BAR_COLOR,
} from "../constants/kpi.constant.ts";

export const DEFAULT_COLORS: Record<KpiType, string> = {
  HOURS_SPENT: HOURS_SPENT_BAR_COLOR,
  MOVED_TO_QA: MOVED_TO_QA_BAR_COLOR,
  RETURN_FROM_QA: RETURN_FROM_QA_BAR_COLOR,
  MOVED_TO_REVIEW: MOVED_TO_REVIEW_BAR_COLOR,
  RETURN_FROM_REVIEW: RETURN_FROM_REVIEW_BAR_COLOR,
} as const;

export const getColorFor = (type: KpiType): string => {
  if (typeof window !== "undefined") {
    const savedColor = localStorage.getItem(
      `${LOCAL_STORAGE_COLOR_KEY_PREFIX}${type}`,
    );
    if (savedColor) {
      return savedColor;
    }
  }

  return DEFAULT_COLORS[type];
};

export const saveColorFor = (type: KpiType, color: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${LOCAL_STORAGE_COLOR_KEY_PREFIX}${type}`, color);
  }
};

export const resetColorFor = (type: KpiType): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${LOCAL_STORAGE_COLOR_KEY_PREFIX}${type}`);
  }
};
