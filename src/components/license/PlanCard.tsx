import React from "react";
import { Check, Loader2 } from "lucide-react";
import { LicensePlan } from "../../types/license.type.ts";

interface PlanCardProps {
    plan: LicensePlan;
    title: string;
    badgeLabel: string;
    description: string;
    features: string[];
    currentPlan: LicensePlan | "NONE";
    isUpdating: boolean;
    onSelect: (plan: LicensePlan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
                                                      plan,
                                                      title,
                                                      badgeLabel,
                                                      description,
                                                      features,
                                                      currentPlan,
                                                      isUpdating,
                                                      onSelect,
                                                  }) => {
    const isCurrent = currentPlan === plan;

    const getContainerStyle = () => {
        if (!isCurrent) {
            return "border-slate-800 hover:border-slate-700 bg-[#0b1120]";
        }
        switch (plan) {
            case "COMMUNITY":
                return "border-green-500 ring-2 ring-green-500/20 bg-gradient-to-b from-green-950/20 via-[#0b1120] to-[#0b1120] shadow-lg shadow-green-950/20";
            case "PRO":
                return "border-cyan-500 ring-2 ring-cyan-500/20 bg-gradient-to-b from-cyan-950/20 via-[#0b1120] to-[#0b1120] shadow-xl shadow-cyan-950/20";
            case "ENTERPRISE":
                return "border-purple-500 ring-2 ring-purple-500/20 bg-gradient-to-b from-purple-950/20 via-[#0b1120] to-[#0b1120] shadow-lg shadow-purple-950/20";
        }
    };

    const getBadgeStyle = () => {
        switch (plan) {
            case "COMMUNITY":
                return "text-green-400 bg-green-500/10 border-green-500/30";
            case "PRO":
                return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
            case "ENTERPRISE":
                return "text-purple-400 bg-purple-500/10 border-purple-500/30";
        }
    };

    const getCheckIconColor = () => {
        switch (plan) {
            case "COMMUNITY":
                return "text-green-400";
            case "PRO":
                return "text-cyan-400";
            case "ENTERPRISE":
                return "text-purple-400";
        }
    };

    const getButtonActiveStyle = () => {
        if (isCurrent) {
            return "bg-slate-800 text-slate-400 cursor-not-allowed opacity-60";
        }
        switch (plan) {
            case "COMMUNITY":
                return "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white shadow-sm";
            case "PRO":
                return "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-400 text-white shadow-lg shadow-cyan-600/20";
            case "ENTERPRISE":
                return "bg-purple-600 hover:bg-purple-500 active:bg-purple-400 text-white shadow-lg shadow-purple-600/20";
        }
    };

    const getButtonLabel = () => {
        if (isCurrent) return "Active Plan";
        if (plan === "COMMUNITY") {
            return currentPlan === "NONE" ? "Choose Community" : "Downgrade to Community";
        }
        if (plan === "PRO") {
            return currentPlan === "ENTERPRISE" ? "Downgrade to Pro" : "Choose Pro Plan";
        }
        return "Upgrade to Enterprise";
    };

    return (
        <div
            className={`border rounded-3xl p-6 flex flex-col justify-between transition-all ${getContainerStyle()}`}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
          <span
              className={`text-xs font-bold uppercase tracking-wider ${
                  plan === "COMMUNITY"
                      ? "text-green-400"
                      : plan === "PRO"
                          ? "text-cyan-400"
                          : "text-purple-400"
              }`}
          >
            {badgeLabel}
          </span>
                    {isCurrent && (
                        <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle()}`}
                        >
              Current
            </span>
                    )}
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>

                <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <Check className={`w-3.5 h-3.5 font-bold ${getCheckIconColor()}`} />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80">
                <button
                    type="button"
                    disabled={isCurrent || isUpdating}
                    onClick={() => onSelect(plan)}
                    className={`w-full py-3 sm:py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${getButtonActiveStyle()}`}
                >
                    {isUpdating ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Switching Plan...</span>
                        </>
                    ) : (
                        <span>{getButtonLabel()}</span>
                    )}
                </button>
            </div>
        </div>
    );
};