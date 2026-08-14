import React, { useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLicense } from "../../context/LicenseContext.tsx";
import { useToast } from "../../toaster/ToastContext.tsx";
import { getPlanBadge } from "../../utils/license.util.ts";

const LICENSE_KEY_REGEX =
  /^WS-[A-Z0-9]{3,4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export const LicenseSettingsSection: React.FC = () => {
  const { toastGood, toastWarn, toastBad } = useToast();
  const {
    license,
    isLoading,
    error: contextError,
    refreshLicense,
    renewLicense,
  } = useLicense();

  const [newKey, setNewKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKey(e.target.value.toUpperCase().trim());
  };

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey) return;

    if (!LICENSE_KEY_REGEX.test(newKey)) {
      toastWarn("Invalid key format. Please use WS-XXXX-XXXX-XXXX-XXXX.");
      return;
    }

    setIsSubmitting(true);
    try {
      await renewLicense(newKey);
      setNewKey("");
      toastGood("License successfully renewed.");
    } catch (err: any) {
      toastBad(err.message || "Failed to renew license.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <form onSubmit={handleRenew} className="space-y-4 pt-2">
        <label
          htmlFor="license-key"
          className="block text-xs font-medium text-slate-300 uppercase tracking-wider"
        >
          Renew License Key
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              id="license-key"
              type="text"
              value={newKey}
              onChange={handleKeyChange}
              placeholder="WS-XXXX-XXXX-XXXX-XXXX"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-lg px-4 py-2 text-sm font-mono tracking-wider placeholder:text-slate-400 transition"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newKey}
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-400 text-white text-sm font-medium transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Apply Key
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
