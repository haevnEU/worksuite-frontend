import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LicensePlan } from "../../types/license.type.ts";

interface PlanSelectionHeaderProps {
    currentPlan: LicensePlan | "NONE";
    username?: string;
}

export const PlanSelectionHeader: React.FC<PlanSelectionHeaderProps> = ({
                                                                            currentPlan,
                                                                            username,
                                                                        }) => {
    const getBadgeColor = () => {
        switch (currentPlan) {
            case "ENTERPRISE":
                return "bg-purple-500/20 border-purple-500/40 text-purple-400";
            case "PRO":
                return "bg-cyan-500/20 border-cyan-500/40 text-cyan-400";
            case "COMMUNITY":
                return "bg-green-500/20 border-green-500/40 text-green-400";
            default:
                return "bg-blue-600/20 border-blue-500/30 text-blue-400";
        }
    };

    const getStatusDotColor = () => {
        switch (currentPlan) {
            case "ENTERPRISE":
                return "bg-purple-400";
            case "PRO":
                return "bg-cyan-400";
            case "COMMUNITY":
                return "bg-green-400";
            default:
                return "bg-slate-500";
        }
    };

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good morning";
        if (hour >= 12 && hour < 18) return "Good afternoon";
        return "Good evening";
    }, []);

    return (
        <header className="border-b border-slate-800/80 bg-[#0b1120]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Left Side: Logo & Back Link */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 group transition-opacity hover:opacity-90"
                        title="Back to Dashboard"
                    >
                        <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black transition-all ${getBadgeColor()}`}
                        >
                            W
                        </div>
                        <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
              Worksuite Identity
            </span>
                    </Link>

                    <div className="hidden sm:block h-4 w-px bg-slate-800" />

                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>To Worksuite</span>
                    </Link>
                </div>

                {/* Right Side: User Greeting & Active Status */}
                <div className="text-xs text-slate-400 flex items-center gap-2">
          <span
              className={`w-2 h-2 rounded-full animate-pulse ${getStatusDotColor()}`}
              title="Active session"
          />
                    <span className="truncate max-w-[160px] sm:max-w-none">
            {greeting},{" "}
                        <strong className="text-slate-200 font-semibold">
              {username || "developer"}
            </strong>
            !
          </span>
                </div>
            </div>
        </header>
    );
};