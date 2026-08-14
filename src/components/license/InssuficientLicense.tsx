import React, { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Sparkles, ArrowLeft, ShieldAlert } from "lucide-react";
import { useLicense } from "../../context/LicenseContext.tsx";
import { LicensePlan } from "../../types/license.type.ts";
import { getPlanBadge } from "../../utils/license.util.ts";

interface InsufficientLicenseGuardProps {
  children: ReactNode;
  minPlan: LicensePlan;
  upgradeUrl?: string;
}

export const InsufficientLicenseGuard: React.FC<
  InsufficientLicenseGuardProps
> = ({ children, minPlan, upgradeUrl = "/settings" }) => {
  const navigate = useNavigate();
  const { hasAccess, plan: currentPlan, isLoading } = useLicense();

  if (isLoading) {
    return <>{children}</>;
  }

  const isAllowed = hasAccess(minPlan);

  if (!isAllowed) {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[#0f172a] border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>403 • Feature Restricted</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white mb-2">
            Plan Upgrade Required
          </h1>

          <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-xs">
            This feature requires the{" "}
            <span
              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold border ${getPlanBadge(
                minPlan,
              )}`}
            >
              {minPlan}
            </span>{" "}
            tier or higher. Your current plan is{" "}
            <span className="font-semibold text-slate-200">{currentPlan}</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 border border-slate-700/80 hover:border-slate-600 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Go Back</span>
            </button>

            {upgradeUrl && (
              <Link
                to={upgradeUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade Plan</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
