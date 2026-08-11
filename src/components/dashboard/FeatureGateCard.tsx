import React from "react";
import { KeyRound, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureGateCardProps {
    hasKey: boolean;
    featureName: string;
    serviceName: string;
    accentColor?: "orange" | "blue";
    children: React.ReactNode;
}

export const FeatureGateCard: React.FC<FeatureGateCardProps> = ({
                                                                    hasKey,
                                                                    featureName,
                                                                    serviceName,
                                                                    accentColor = "orange",
                                                                    children,
                                                                }) => {
    const navigate = useNavigate();

    if (hasKey) {
        return <>{children}</>;
    }

    const isOrange = accentColor === "orange";
    const iconColor = isOrange ? "text-orange-400 bg-orange-950/60 border-orange-800/60" : "text-sky-400 bg-sky-950/60 border-sky-800/60";
    const btnColor = isOrange ? "bg-orange-600 hover:bg-orange-500" : "bg-sky-600 hover:bg-sky-500";

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 font-sans">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${iconColor}`}>
                <KeyRound className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-md">
                <h3 className="text-base font-bold text-white">{featureName} Locked</h3>
                <p className="text-xs text-slate-400">
                    This widget is disabled because no <span className="font-semibold text-slate-300">{serviceName}</span> API key is configured.
                </p>
            </div>

            <button
                onClick={() => navigate("/settings")}
                className={`px-4 py-2 text-white font-bold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer shadow-md ${btnColor}`}
            >
                <Settings className="w-3.5 h-3.5" />
                <span>Configure {serviceName} Key</span>
            </button>
        </div>
    );
};