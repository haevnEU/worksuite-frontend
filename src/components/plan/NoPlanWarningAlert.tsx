import React from "react";
import { AlertTriangle } from "lucide-react";

export const NoPlanWarningAlert: React.FC = () => {
    return (
        <div className="mb-6 sm:mb-8 p-4 bg-amber-950/70 border border-amber-700/60 rounded-2xl text-amber-300 text-xs font-semibold flex items-center gap-3 shadow-lg shadow-amber-950/20">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
        No active subscription found. Please select a plan below or redeem an
        existing license key.
      </span>
        </div>
    );
};