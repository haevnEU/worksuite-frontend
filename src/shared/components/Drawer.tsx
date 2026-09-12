import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  widthClass?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  widthClass = "sm:w-[460px]",
  children,
  footer,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 xl:hidden animate-in fade-in duration-200"
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full ${widthClass} bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-6 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div>{title}</div>
            {subtitle && <div className="mt-1">{subtitle}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
          {children}
        </div>

        {footer && (
          <div className="pt-4 border-t border-slate-800 shrink-0">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
};
