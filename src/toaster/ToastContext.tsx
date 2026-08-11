import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { ToastManager, ToastOptions, ToastType } from "./ToastManager";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, options?: ToastOptions) => void;
  toastGood: (message: string, options?: ToastOptions) => void;
  toastBad: (message: string, options?: ToastOptions) => void;
  toastWarn: (message: string, options?: ToastOptions) => void;
  toastInfo: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_STYLES = {
  info: {
    border: "border-blue-500/40",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    titleColor: "text-blue-400",
    Icon: Info,
    defaultTitle: "Info",
  },
  success: {
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    titleColor: "text-emerald-400",
    Icon: CheckCircle2,
    defaultTitle: "Erfolgreich",
  },
  warn: {
    border: "border-amber-500/40",
    iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    titleColor: "text-amber-400",
    Icon: AlertTriangle,
    defaultTitle: "Warnung",
  },
  error: {
    border: "border-rose-500/40",
    iconBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    titleColor: "text-rose-400",
    Icon: AlertCircle,
    defaultTitle: "Fehler",
  },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions,
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = {
      id,
      message,
      type,
      title: options?.title,
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      removeToast(id);
    }, options?.duration || 5000);
  };
  useEffect(() => {
    ToastManager.register((message, type, options) => {
      addToast(message, type, options);
    });

    return () => {
      ToastManager.unregister();
    };
  }, []);

  const toast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions,
  ) => addToast(message, type, options);

  const toastGood = (message: string, options?: ToastOptions) =>
    addToast(message, "success", options);

  const toastBad = (message: string, options?: ToastOptions) =>
    addToast(message, "error", options);

  const toastWarn = (message: string, options?: ToastOptions) =>
    addToast(message, "warn", options);

  const toastInfo = (message: string, options?: ToastOptions) =>
    addToast(message, "info", options);

  return (
    <ToastContext.Provider
      value={{ toast, toastGood, toastBad, toastWarn, toastInfo }}
    >
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-md w-full px-4 pointer-events-none">
          {toasts.map((t) => {
            const style = TOAST_STYLES[t.type];
            const Icon = style.Icon;

            return (
              <div
                key={t.id}
                className={`pointer-events-auto bg-slate-900/95 border ${style.border} text-slate-100 rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-start space-x-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3`}
              >
                <div
                  className={`p-1.5 border rounded-lg shrink-0 mt-0.5 ${style.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between space-x-2 mb-0.5">
                    <span className={`font-bold ${style.titleColor}`}>
                      {t.title || style.defaultTitle}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {t.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  title="Schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
