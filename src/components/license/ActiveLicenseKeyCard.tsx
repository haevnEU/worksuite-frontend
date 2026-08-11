import React, { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import { LicensePlan } from "../../types/license.type.ts";

interface ActiveLicenseKeyCardProps {
    licenseKey: string;
    currentPlan: LicensePlan | "NONE";
}

export const ActiveLicenseKeyCard: React.FC<ActiveLicenseKeyCardProps> = ({
                                                                              licenseKey,
                                                                              currentPlan,
                                                                          }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(licenseKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = licenseKey;
            textArea.style.position = "fixed";
            textArea.style.top = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getCardTheme = () => {
        switch (currentPlan) {
            case "ENTERPRISE":
                return "border-purple-500/40 ring-1 ring-purple-500/20 bg-gradient-to-r from-purple-950/30 via-[#0b1120] to-[#0b1120]";
            case "PRO":
                return "border-cyan-500/40 ring-1 ring-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-[#0b1120] to-[#0b1120]";
            case "COMMUNITY":
                return "border-green-500/40 ring-1 ring-green-500/20 bg-gradient-to-r from-green-950/30 via-[#0b1120] to-[#0b1120]";
            default:
                return "border-slate-800 bg-[#0b1120]";
        }
    };

    const getIconTheme = () => {
        switch (currentPlan) {
            case "ENTERPRISE":
                return "bg-purple-950/80 border-purple-800/60 text-purple-400";
            case "PRO":
                return "bg-cyan-950/80 border-cyan-800/60 text-cyan-400";
            case "COMMUNITY":
                return "bg-green-950/80 border-green-800/60 text-green-400";
            default:
                return "bg-slate-900 border-slate-700 text-slate-400";
        }
    };

    const getCodeTheme = () => {
        switch (currentPlan) {
            case "ENTERPRISE":
                return "text-purple-300 border-purple-900/60";
            case "PRO":
                return "text-cyan-300 border-cyan-900/60";
            case "COMMUNITY":
                return "text-green-300 border-green-900/60";
            default:
                return "text-slate-300 border-slate-800";
        }
    };

    return (
        <div
            className={`mb-8 sm:mb-10 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl relative overflow-hidden backdrop-blur-md border transition-all ${getCardTheme()}`}
        >
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                <div
                    className={`p-2.5 sm:p-3 rounded-2xl shrink-0 border shadow-inner transition-all ${getIconTheme()}`}
                >
                    <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Active License Key
                    </div>
                    <div className="mt-0.5">
                        <code
                            className={`block truncate font-mono text-xs sm:text-base font-bold tracking-wider select-all px-2.5 py-0.5 rounded-lg bg-slate-950/90 border ${getCodeTheme()}`}
                        >
                            {licenseKey}
                        </code>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={handleCopy}
                className={`w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl transition-all border flex items-center justify-center space-x-2 cursor-pointer shadow-sm ${
                    copied
                        ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                        : "bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 border-slate-700"
                }`}
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied!</span>
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy Key</span>
                    </>
                )}
            </button>
        </div>
    );
};