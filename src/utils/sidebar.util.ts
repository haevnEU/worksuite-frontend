import { NavItem } from "../models/sidebar.model.ts";

const FAVORITES_STORAGE_KEY = "worktool_sidebar_manual_favorites";
export const MAX_FAVORITES = 3;

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
  } else {
    if (current.length >= MAX_FAVORITES) {
      return { favorites: current, isAdded: false };
    }
    updated = [...current, path];
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  return { favorites: updated, isAdded: !exists };
};

export const getPinnedFavoriteItems = (allItems: NavItem[]): NavItem[] => {
  const paths = getFavoritePaths();
  // Map über die gespeicherten Pfade, um Reihenfolge zu wahren
  return paths
    .map((path) => allItems.find((item) => item.path === path))
    .filter((item): item is NavItem => item !== undefined);
};
