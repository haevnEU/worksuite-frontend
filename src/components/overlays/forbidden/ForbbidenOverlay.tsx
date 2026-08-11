// src/components/overlays/forbidden/ForbiddenOverlay.tsx
import React from "react";
import { X, ShieldX, Lock, ShieldCheck, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLicense } from "../../../context/LicenseContext.tsx";

interface ForbiddenOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForbiddenOverlay: React.FC<ForbiddenOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { plan } = useLicense();

  if (!isOpen) return null;

  const handleUpgradeOrPlans = () => {
    onClose();
    navigate("/plans");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-xl bg-slate-900/95 border border-amber-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-amber-500/10 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <ShieldX className="w-3.5 h-3.5 text-amber-400" />
          <span>Access Denied • RFC 9110</span>
        </div>

        {/* Header Icon & Text */}
        <div className="flex flex-col items-center">
          <div className="relative p-5 bg-gradient-to-b from-amber-500/20 to-amber-950/30 border border-amber-500/30 rounded-2xl text-amber-400 mb-6 shadow-lg shadow-amber-500/10">
            <Lock className="w-12 h-12 text-amber-400 stroke-[1.75]" />
          </div>

          <div className="max-w-md space-y-2 mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Insufficient Permissions
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              The server understood your request, but answered with{" "}
              <span className="text-amber-400 font-semibold">
                HTTP 403 Forbidden
              </span>
              .
            </p>
            <p className="text-xs text-slate-500">
              Your active plan or user role lacks the required authorization to
              perform this action.
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full bg-[#0b111e]/90 border border-slate-800 rounded-xl p-4 md:p-5 mb-6 text-left shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              RBAC & License Restriction
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Tier Guard
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-amber-300 space-y-1 overflow-x-auto">
            <div className="text-slate-400">
              &gt; GET /api/v1/protected-resource
            </div>
            <div className="text-amber-400 font-bold">
              &lt; HTTP/1.1 403 Forbidden
            </div>
            <div className="text-slate-500">
              &lt; X-Required-Plan: PRO / ENTERPRISE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Current Plan:{" "}
                <strong className="text-white font-mono uppercase">
                  {plan || "COMMUNITY"}
                </strong>
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Action: <strong>Upgrade or contact Admin</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={handleUpgradeOrPlans}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-amber-600/25"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>View Available Plans</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
