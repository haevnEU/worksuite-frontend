import { HttpError } from "../exception/http.error.ts";

type ErrorListener = (error: HttpError | null) => void;
let currentError: HttpError | null = null;
const listeners: Set<ErrorListener> = new Set();

export const GlobalErrorManager = {
  showError(error: HttpError) {
    currentError = error;
    listeners.forEach((listener) => listener(currentError));
  },
  clearError() {
    currentError = null;
    listeners.forEach((listener) => listener(null));
  },
  subscribe(listener: ErrorListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getCurrentError() {
    return currentError;
  },
};
