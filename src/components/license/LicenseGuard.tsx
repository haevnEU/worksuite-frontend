import React, { ReactNode, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CreditCard, KeyRound, LogOut } from "lucide-react";
import { LicenseStateManagerInstance } from "../../state/license.state.ts";
import { useAuth } from "../../context/AuthContext.tsx";

interface LicenseGuardProps {
  children: ReactNode;
  renewUrl?: string;
}

export const LicenseGuard: React.FC<LicenseGuardProps> = ({
  children,
  renewUrl = "/license/renew",
}) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isLicenseExpired, setIsLicenseExpired] = useState<boolean>(
    LicenseStateManagerInstance.getIsExpired(),
  );

  useEffect(() => {
    return LicenseStateManagerInstance.subscribe((expired) => {
      setIsLicenseExpired(expired);
    });
  }, []);

  const isPublicRoute =
    location.pathname.startsWith("/public") ||
    location.pathname.startsWith("/license/renew") ||
    location.pathname.startsWith("/login");

  if (isLicenseExpired && !isPublicRoute) {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[#0f172a] border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-700/60 text-violet-300 text-xs font-bold uppercase tracking-wider mb-6">
            <KeyRound className="w-3.5 h-3.5 text-violet-400" />
            <span>402 • Payment Required</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-violet-400 mb-6 shadow-inner">
            <CreditCard className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white mb-2">
            Workspace License Expired
          </h1>

          <p className="text-slate-400 text-xs leading-relaxed mb-8 max-w-xs">
            Your workspace subscription or license has expired. Access to
            backend services and the user interface is locked.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              type="button"
              onClick={logout}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 border border-slate-700/80 hover:border-slate-600 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Logout</span>
            </button>

            {renewUrl && (
              <Link
                to={renewUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25"
              >
                <span>Renew License</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
