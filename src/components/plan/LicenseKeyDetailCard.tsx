import React, { useState } from "react";
import { KeyRound, Copy, Check, Eye, EyeOff, Calendar } from "lucide-react";
import { LicensePlan } from "../../types/license.type.ts";

interface LicenseKeyDetailCardProps {
    licenseKey: string | null;
    currentPlan: LicensePlan | "NONE";
    expiresAt?: string;
}

export const LicenseKeyDetailCard: React.FC<LicenseKeyDetailCardProps> = ({
                                                                              licenseKey,
                                                                              currentPlan,
                                                                              expiresAt,
                                                                          }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const handleCopy = async () => {
        if (!licenseKey) return;
        await navigator.clipboard.writeText(licenseKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const formatDate = (isoString?: string) => {
        if (!isoString) return "Perpetual";
        return new Date(isoString).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    return (
        <div className="bg-[#0b1120]/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Active Key Reference
                        </h3>
                        <span className="text-[11px] text-slate-400">
              Tier: <strong className="text-slate-200 font-mono">{currentPlan}</strong>
            </span>
                    </div>
                </div>

                {expiresAt && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(expiresAt)}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-end space-y-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Digital Token
        </span>
                <div className="flex items-center gap-2 bg-[#020617] border border-slate-800 rounded-xl p-2.5">
                    <input
                        type={showKey ? "text" : "password"}
                        readOnly
                        value={licenseKey || "NO_ACTIVE_LICENSE"}
                        className="bg-transparent text-xs font-mono text-slate-300 w-full focus:outline-none select-all"
                    />

                    {licenseKey && (
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowKey((prev) => !prev)}
                                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                                title={showKey ? "Hide key" : "Show key"}
                            >
                                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>

                            <button
                                type="button"
                                onClick={handleCopy}
                                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                                title="Copy key"
                            >
                                {isCopied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};