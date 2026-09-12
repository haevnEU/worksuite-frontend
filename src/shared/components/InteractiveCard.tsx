import React from "react";

interface InteractiveCardProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = React.memo(
  ({ isSelected, onClick, children, className = "" }) => {
    return (
      <div
        onClick={onClick}
        className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none ${
          isSelected
            ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
            : "bg-slate-900/80 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700"
        } ${className}`}
      >
        {children}
      </div>
    );
  },
);

InteractiveCard.displayName = "InteractiveCard";
