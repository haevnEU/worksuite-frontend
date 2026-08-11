import React from "react";
import { KeyRound, Settings, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MissingApiKeyCardProps {
    title: string;
    serviceName: string;
    description: string;
    accentColor?: "orange" | "blue" | "emerald";
}

export const MissingApiKeyCard: React.FC<MissingApiKeyCardProps> = ({
                                                                        title,
                                                                        serviceName,
                                                                        description,
                                                                        accentColor = "orange",
                                                                    }) => {
    const navigate = useNavigate();

    const colorStyles = {
        orange: {
            border: "border-orange-800/40",
            bg: "bg-orange-950/20",
            iconBg: "bg-orange-950/60 border-orange-800/60 text-orange-400",
            btn: "bg-orange-600 hover:bg-orange-500 text-white",
            badge: "bg-orange-950/60 text-orange-400 border-orange-800/60",
        },
        blue: {
            border: "border-sky-800/40",
            bg: "bg-sky-950/20",
            iconBg: "bg-sky-950/60 border-sky-800/60 text-sky-400",
            btn: "bg-sky-600 hover:bg-sky-500 text-white",
            badge: "bg-sky-950/60 text-sky-400 border-sky-800/60",
        },
        emerald: {
            border: "border-emerald-800/40",
            bg: "bg-emerald-950/20",
            iconBg: "bg-emerald-950/60 border-emerald-800/60 text-emerald-400",
            btn: "bg-emerald-600 hover:bg-emerald-500 text-white",
            badge: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
        },
    }[accentColor];

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl shadow-xs text-center max-w-xl mx-auto my-12 space-y-6">
            <div className={`p-4 rounded-2xl border ${colorStyles.iconBg}`}>
                <KeyRound className="w-8 h-8" />
            </div>

            <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mb-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Configuration Required</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{title}</h2>
                <p className="text-sm text-slate-400 max-w-md">{description}</p>
            </div>

            <div className={`p-4 rounded-xl border text-xs text-left w-full text-slate-300 space-y-1 ${colorStyles.bg} ${colorStyles.border}`}>
                <p className="font-semibold text-slate-200">
                    Notice: {serviceName} API Key Missing
                </p>
                <p className="text-slate-400">
                    To display and synchronize your data, please provide a valid personal API access token in the settings menu.
                </p>
            </div>

            <button
                onClick={() => navigate("/settings")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-colors cursor-pointer shadow-md ${colorStyles.btn}`}
            >
                <Settings className="w-4 h-4" />
                <span>Go to Settings</span>
            </button>
        </div>
    );
};