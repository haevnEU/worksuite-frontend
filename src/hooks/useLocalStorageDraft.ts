import { useEffect, useRef, useState } from "react";

export function useLocalStorageDraft<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>, () => void, string | null] {
  const isFirstRender = useRef(true);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(`draft_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.warn(`Error reading localStorage draft for ${key}`, e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`draft_${key}`, JSON.stringify(value));
      if (!isFirstRender.current) {
        const timeStr = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setLastSavedTime(timeStr);
      } else {
        isFirstRender.current = false;
      }
    } catch (e) {
      console.warn(`Error writing localStorage draft for ${key}`, e);
    }
  }, [key, value]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(`draft_${key}`);
      setLastSavedTime(null);
    } catch (e) {
      console.warn(`Error clearing draft for ${key}`, e);
    }
    setValue(initialValue);
  };

  return [value, setValue, clearDraft, lastSavedTime];
}
