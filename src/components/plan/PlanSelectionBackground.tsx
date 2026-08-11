import React from "react";
import { LicensePlan } from "../../types/license.type.ts";

interface PlanSelectionBackgroundProps {
    currentPlan: LicensePlan | "NONE";
}

export const PlanSelectionBackground: React.FC<PlanSelectionBackgroundProps> = ({ currentPlan }) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {currentPlan === "NONE" && (
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-blue-600/10 rounded-full blur-[100px] sm:blur-[140px]" />
            )}
            {currentPlan === "COMMUNITY" && (
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-green-500/15 rounded-full blur-[100px] sm:blur-[140px]" />
            )}
            {currentPlan === "PRO" && (
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-cyan-500/15 rounded-full blur-[100px] sm:blur-[140px]" />
            )}
            {currentPlan === "ENTERPRISE" && (
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[500px] bg-purple-500/15 rounded-full blur-[100px] sm:blur-[140px]" />
            )}
        </div>
    );
};