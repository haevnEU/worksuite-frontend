// src/components/overlays/unauthorized/UnauthorizedOverlay.tsx
import React from "react";
import { X, LogIn, ArrowRight, ShieldAlert, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.tsx";

interface UnauthorizedOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnauthorizedOverlay: React.FC<UnauthorizedOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  if (!isOpen) return null;

  const handleGoToLogin = () => {
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-xl bg-slate-900/95 border border-rose-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-rose-500/10 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Authentication Error • RFC 9110</span>
        </div>

        {/* Header Icon & Text */}
        <div className="flex flex-col items-center">
          <div className="relative p-5 bg-gradient-to-b from-rose-500/20 to-rose-950/30 border border-rose-500/30 rounded-2xl text-rose-400 mb-6 shadow-lg shadow-rose-500/10">
            <KeyRound className="w-12 h-12 text-rose-400 stroke-[1.75]" />
          </div>

          <div className="max-w-md space-y-2 mb-6 text-center">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Session Invalid or Expired
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Your request was rejected with{" "}
              <span className="text-rose-400 font-semibold">
                HTTP 401 Unauthorized
              </span>
              .
            </p>
            <p className="text-xs text-slate-500">
              Valid credentials or an active session token are required to
              access this resource.
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full bg-[#0b111e]/90 border border-slate-800 rounded-xl p-4 md:p-5 mb-6 text-left shadow-inner space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Security Context Inspection
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Bearer Token Check
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-rose-300 space-y-1 overflow-x-auto">
            <div className="text-slate-400">
              &gt; Authorization: Bearer eyJhbGciOi...
            </div>
            <div className="text-rose-400 font-bold">
              &lt; HTTP/1.1 401 Unauthorized
            </div>
            <div className="text-slate-500">
              &lt; WWW-Authenticate: Bearer error="invalid_token"
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <span className="text-base">👤</span>
              <span>
                Account:{" "}
                <strong>
                  {user?.username ||
                    user?.firstName + " " + user?.lastName ||
                    "Anonymous"}
                </strong>
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <span className="text-base">🔄</span>
              <span>
                Remedy: <strong>Sign in again</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={handleGoToLogin}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-600/25"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
