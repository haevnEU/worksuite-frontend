import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface ManualKeyActivationCardProps {
    onActivate: (key: string) => Promise<void>;
    isLoading: boolean;
}

export const ManualKeyActivationCard: React.FC<ManualKeyActivationCardProps> = ({
                                                                                    onActivate,
                                                                                    isLoading,
                                                                                }) => {
    const [inputKey, setInputKey] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputKey.trim() || isLoading) return;
        await onActivate(inputKey.trim());
        setInputKey("");
    };

    return (
        <div className="bg-[#0b1120]/80 border border-slate-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                            Redeem License Key
                        </h3>
                        <span className="text-[11px] text-slate-400">
              Apply a manual subscription key
            </span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-end space-y-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Enter Token / Voucher
        </span>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="HAUSHELD-XXXX-XXXX-XXXX"
                        className="bg-[#020617] border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-slate-200 w-full focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600"
                    />
                    <button
                        type="submit"
                        disabled={!inputKey.trim() || isLoading}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                        {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <>
                                <span>Activate</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};