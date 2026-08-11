import { NavItem } from "../models/sidebar.model.ts";

const FAVORITES_STORAGE_KEY = "worktool_sidebar_manual_favorites";
export const MAX_FAVORITES = 3;

export const triggerHapticFeedback = (duration = 10) => {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  ) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignore vibration errors on unsupported platforms
    }
  }
};

export const getFavoritePaths = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleFavoritePath = (
  path: string,
): { favorites: string[]; isAdded: boolean } => {
  const current = getFavoritePaths();
  const exists = current.includes(path);

  let updated: string[];
  if (exists) {
    updated = current.filter((p) => p !== path);
    triggerHapticFeedback(8); // Sanfter Impuls beim Entfernen
  } else {
    if (current.length >= MAX_FAVORITES) {
      triggerHapticFeedback(25); // Doppelter Warn-Impuls
      return { favorites: current, isAdded: false };
    }
    updated = [...current, path];
    triggerHapticFeedback(12); // Bestätigungs-Impuls beim Hinzufügen
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  return { favorites: updated, isAdded: !exists };
};

export const getPinnedFavoriteItems = (allItems: NavItem[]): NavItem[] => {
  const paths = getFavoritePaths();
  return paths
    .map((path) => allItems.find((item) => item.path === path))
    .filter((item): item is NavItem => item !== undefined);
};
