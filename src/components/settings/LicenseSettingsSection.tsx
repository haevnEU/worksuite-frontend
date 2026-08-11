import React from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { useLicense } from "../../context/LicenseContext.tsx";
import { useAuth } from "../../context/AuthContext.tsx";
import { getPlanBadge } from "../../utils/license.util.ts";

export const LicenseSettingsSection: React.FC = () => {
  const { token } = useAuth();
  const {
    license,
    isLoading,
    error: contextError,
    refreshLicense,
  } = useLicense();

  const formatDate = (isoString?: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading && !license) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse">
          <div className="h-6 w-48 bg-slate-800 rounded mb-4" />
          <div className="h-20 bg-slate-950/60 rounded mb-4" />
          <div className="h-10 bg-slate-800 rounded" />
        </div>
    );
  }

  return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                License & Plan
              </h3>
              <p className="text-xs text-slate-400">
                Manage your product license, expiration dates, and feature tier.
              </p>
            </div>
          </div>
          <button
              onClick={refreshLicense}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {contextError && (
            <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{contextError}</span>
            </div>
        )}

        {license && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Status & Plan
            </span>
                <div className="flex items-center justify-between">
              <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getPlanBadge(
                      license.plan,
                  )}`}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                {license.plan || "NONE"}
              </span>

                  {license.valid ? (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
                </span>
                  ) : (
                      <span className="inline-flex items-center text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Expired
                </span>
                  )}
                </div>
                {license.message && (
                    <p className="text-xs text-slate-400 pt-1">{license.message}</p>
                )}
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Valid Until
            </span>
                <div className="flex items-center space-x-2 text-slate-200">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium">
                {formatDate(license.expiresAt)}
              </span>
                </div>
                <p className="text-xs text-slate-400">
                  {license.valid
                      ? "Full system access granted."
                      : "License has expired. Please renew."}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Timestamps
            </span>
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span className="text-slate-300 font-mono">
                  {formatDate(license.createdAt)}
                </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Updated:</span>
                    <span className="text-slate-300 font-mono">
                  {formatDate(license.updatedAt)}
                </span>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Plan Management Action Area */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Want to change tiers, renew your subscription, or view your current license key?
          </div>
          <a
              href={"/plans"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage Subscription Plan</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-indigo-200" />
          </a>
        </div>
      </div>
  );
};