import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Lock,
  LogIn,
  User,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.tsx";

const RECENT_USERS_KEY = "recent_usernames";
const MAX_RECENT_USERS = 2;

export const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const [recentUsers, setRecentUsers] = useState<string[]>([]);
  const [isSelectingRecentUser, setIsSelectingRecentUser] =
    useState<boolean>(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_USERS_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentUsers(parsed);
          setUsername(parsed[0]);
          setIsSelectingRecentUser(true);
          return;
        }
      }

      // Abwärtskompatibilität: Falls noch der alte Einzelschlüssel "last_username" existiert
      const legacyLastUser = localStorage.getItem("last_username");
      if (legacyLastUser) {
        setRecentUsers([legacyLastUser]);
        setUsername(legacyLastUser);
        setIsSelectingRecentUser(true);
      }
    } catch {
      // Ignorieren falls JSON fehlerhaft war
    }
  }, []);

  const saveRecentUser = (userToSave: string) => {
    const trimmed = userToSave.trim();
    if (!trimmed) return;

    // Den aktuellen User an den Anfang setzen, Duplikate entfernen und auf 2 begrenzen
    const updated = [
      trimmed,
      ...recentUsers.filter((u) => u.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_RECENT_USERS);

    setRecentUsers(updated);
    localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(updated));
  };

  const handleSelectUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__NEW__") {
      setIsSelectingRecentUser(false);
      setUsername("");
    } else {
      setIsSelectingRecentUser(true);
      setUsername(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await register(username, password, firstName, lastName);

        setIsRegistering(false);
        setSuccessMessage("Account successfully created! Please sign in.");

        setFirstName("");
        setLastName("");
        setPassword("");
      } else {
        const response = await fetch("/api/v1/user-service/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error("Invalid username or password");
        }
        const data = await response.json();

        // Letzte 2 Benutzer aktualisieren
        saveRecentUser(username);

        login(data.token, data.user);
      }
    } catch (err: any) {
      setError(
        err.message ||
          (isRegistering
            ? "Registration failed."
            : "Login failed. Please check your credentials."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setSuccessMessage(null);
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-blue-400 mb-4 shadow-inner">
            {isRegistering ? (
              <UserPlus className="w-8 h-8 stroke-[1.75]" />
            ) : (
              <Lock className="w-8 h-8 stroke-[1.75]" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isRegistering
              ? "Sign up to access your dashboard & workspace"
              : "Sign in to access your dashboard & workspace"}
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-emerald-400 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-red-400 text-xs flex items-center space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  First Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Last Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Username
              </label>
              {!isRegistering &&
                !isSelectingRecentUser &&
                recentUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectingRecentUser(true);
                      setUsername(recentUsers[0]);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Choose recent user
                  </button>
                )}
            </div>

            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />

              {!isRegistering &&
              recentUsers.length > 0 &&
              isSelectingRecentUser ? (
                <div className="relative">
                  <select
                    value={username}
                    onChange={handleSelectUserChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                  >
                    {recentUsers.map((userItem, index) => (
                      <option key={userItem} value={userItem}>
                        {userItem} {index === 0 ? "(Last login)" : "(Previous)"}
                      </option>
                    ))}
                    <option value="__NEW__">+ Another user...</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ) : (
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>{isRegistering ? "Registering..." : "Signing in..."}</span>
            ) : (
              <>
                {isRegistering ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-slate-400 hover:text-blue-400 font-semibold transition-colors cursor-pointer"
          >
            {isRegistering
              ? "Already have an account? Sign In"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};
