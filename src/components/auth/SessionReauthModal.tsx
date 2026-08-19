import React, { useEffect, useState } from "react";
import { Lock, LogOut, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext.tsx";
import { authEvents } from "../../utils/auth.util.ts";

export const SessionReauthModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, logout, reauth } = useAuth();

  // Lauscht auf das Event aus dem fetchClient / Axios Interceptor
  useEffect(() => {
    const unsubscribe = authEvents.onSessionExpired(() => {
      setIsOpen(true);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleReauth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await reauth(password);
      // Wenn erfolgreich: Modal schließen, Passwort-Feld leeren
      setPassword("");
      setIsOpen(false);
    } catch {
      setError("Invalid password. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (!user) return "User";
    const first = (user as any).firstname || (user as any).firstName || "";
    const last = (user as any).lastname || (user as any).lastName || "";
    return `${first} ${last}`.trim() || (user as any).username || "User";
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Session Expired</h2>
            <p className="text-xs text-slate-400">
              Confirm your password to keep working without losing changes.
            </p>
          </div>
        </div>

        {/* User Badge */}
        <div className="p-3 mb-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
            {getDisplayName()[0] || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-200 truncate">
              {getDisplayName()}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {(user as any).username ||
                (user as any).email ||
                "Logged-in user"}
            </div>
          </div>
        </div>

        {/* Formular */}
        <form onSubmit={handleReauth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <span>{loading ? "Verifying..." : "Unlock & Continue"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Logout Fallback */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">Not you?</span>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out completely</span>
          </button>
        </div>
      </div>
    </div>
  );
};
