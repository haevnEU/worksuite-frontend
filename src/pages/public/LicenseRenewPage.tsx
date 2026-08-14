import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { licenseService } from "../../services/network/license.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { LicenseStateManagerInstance } from "../../state/license.state.ts";

export const LicenseRenewPage: React.FC = () => {
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = licenseKey.trim();

    if (!cleanKey) {
      setErrorMessage("Please enter a valid workspace license key.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await licenseService.renewLicense(cleanKey);

      setIsSuccess(true);
      ToastManager.toastGood("License successfully renewed!");

      LicenseStateManagerInstance.setExpired(false);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      console.error("License renewal failed:", err);
      const detail =
        err?.responseBody ||
        "Invalid or expired license key. Please check your credentials.";
      setErrorMessage(detail);
      ToastManager.toastBad("Failed to renew license.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10rem] left-[-10rem] w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10rem] right-[-10rem] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-700/60 text-violet-300 text-xs font-bold uppercase tracking-wider mb-6">
            <KeyRound className="w-3.5 h-3.5 text-violet-400" />
            <span>Workspace Subscription</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#020617]/80 border border-slate-800 flex items-center justify-center text-violet-400 mb-4 shadow-inner">
            <CreditCard className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Renew Workspace License
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
            Enter your new license key below to unlock API access, ticket
            workflows, and team collaboration features.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              License Activated
            </h3>
            <p className="text-xs text-slate-300">
              Your workspace is fully unlocked. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}

            <div className="space-y-2 text-left">
              <label
                htmlFor="licenseKey"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                License Key
              </label>
              <div className="relative">
                <input
                  id="licenseKey"
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="WS-XXXX-XXXX-XXXX-XXXX"
                  disabled={isLoading}
                  className="w-full bg-[#020617] border border-slate-700/80 focus:border-violet-500 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                />
                <ShieldCheck className="w-5 h-5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500">
                Format: 24-character alpha-numeric subscription key
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !licenseKey.trim()}
              className="w-full py-3.5 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating Key...</span>
                </>
              ) : (
                <>
                  <span>Activate Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Feature List / Notice */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>Instant workspace unlocking</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>Secure TLS license validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
