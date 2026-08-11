import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSessionStorageOptions {
  syncState?: boolean;
}

interface StorageEnvelope<T> {
  data: T;
  timestamp: string | null;
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  options: UseSessionStorageOptions = {},
): [
  value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  remove: () => void,
  reload: () => void,
  lastSavedTime: string | null,
] {
  const { syncState = true } = options;

  const initialValueRef = useRef(initialValue);
  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  const currentKeyRef = useRef(key);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const getFormattedTime = (): string =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const readStorage = useCallback((): { value: T; time: string | null } => {
    if (typeof window === "undefined") {
      return { value: initialValueRef.current, time: null };
    }
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as StorageEnvelope<T>;
        if (parsed && typeof parsed === "object" && "data" in parsed) {
          return { value: parsed.data, time: parsed.timestamp };
        }
        return { value: parsed as unknown as T, time: null };
      }
      return { value: initialValueRef.current, time: null };
    } catch (e) {
      console.warn(
        `[useSessionStorage] Fehler beim Lesen von Key "${key}":`,
        e,
      );
      return { value: initialValueRef.current, time: null };
    }
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    return readStorage().value;
  });

  useEffect(() => {
    if (currentKeyRef.current !== key) {
      currentKeyRef.current = key;
      const current = readStorage();
      setStoredValue(current.value);
      setLastSavedTime(current.time);
    }
  }, [key, readStorage]);

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (valueOrFn) => {
      try {
        setStoredValue((prev) => {
          const newValue =
            valueOrFn instanceof Function ? valueOrFn(prev) : valueOrFn;
          const timeStr = getFormattedTime();

          if (typeof window !== "undefined") {
            const envelope: StorageEnvelope<T> = {
              data: newValue,
              timestamp: timeStr,
            };
            window.sessionStorage.setItem(key, JSON.stringify(envelope));
            setLastSavedTime(timeStr);

            if (syncState) {
              window.dispatchEvent(
                new CustomEvent("session-storage-change", {
                  detail: { key, value: newValue, time: timeStr },
                }),
              );
            }
          }
          return newValue;
        });
      } catch (e) {
        console.warn(
          `[useSessionStorage] Fehler beim Schreiben von Key "${key}":`,
          e,
        );
      }
    },
    [key, syncState],
  );

  const remove = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
        setLastSavedTime(null);

        if (syncState) {
          window.dispatchEvent(
            new CustomEvent("session-storage-change", {
              detail: { key, value: initialValueRef.current, time: null },
            }),
          );
        }
      }
    } catch (e) {
      console.warn(
        `[useSessionStorage] Fehler beim Löschen von Key "${key}":`,
        e,
      );
    }
    setStoredValue(initialValueRef.current);
  }, [key, syncState]);

  const reload = useCallback(() => {
    const loaded = readStorage();
    setStoredValue(loaded.value);
    setLastSavedTime(loaded.time);
  }, [readStorage]);

  useEffect(() => {
    if (!syncState || typeof window === "undefined") return;

    const handleStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        key: string;
        value: T;
        time: string | null;
      }>;
      if (customEvent.detail?.key === key) {
        setStoredValue(customEvent.detail.value);
        setLastSavedTime(customEvent.detail.time);
      }
    };

    window.addEventListener("session-storage-change", handleStorageChange);
    return () => {
      window.removeEventListener("session-storage-change", handleStorageChange);
    };
  }, [key, syncState]);

  return [storedValue, setValue, remove, reload, lastSavedTime];
}
