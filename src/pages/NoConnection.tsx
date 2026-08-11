import React, { useState } from "react";
import { AlertCircle, Loader2, RefreshCw, WifiOff } from "lucide-react";

interface NoConnectionPageProps {
  onRetry: () => void;
}

export const NoConnectionPage: React.FC<NoConnectionPageProps> = ({
  onRetry,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    onRetry();

    setTimeout(() => setIsRetrying(false), 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-slate-950">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Status Badge mit Pulsieren */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Connection Lost</span>
        </div>

        {/* Centered Offline Icon */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-3xl text-slate-400 mb-6 shadow-inner">
          <WifiOff className="w-12 h-12 text-slate-500 stroke-[1.75]" />
        </div>

        {/* Title & Description */}
        <div className="max-w-md space-y-2 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Unable to Connect to Server
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            We couldn't establish a connection to the backend service API
          </p>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Please check your network connection.
          </p>
        </div>

        {/* Retry Action */}
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed mb-4"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
          />
          <span>{isRetrying ? "Checking Connection..." : "Try Again"}</span>
        </button>

        {/* Continuous Reconnect Notice */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mb-10">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500/70" />
          <span>
            Automatic reconnect attempts are running in the background...
          </span>
        </div>

        {/* Troubleshooting Steps */}
        <div className="w-full max-w-lg bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 text-left space-y-2.5 backdrop-blur-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800/80 pb-2">
            Troubleshooting Steps
          </span>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            <li>Verify your local internet connection.</li>
            <li>Ensure the backend service container is running properly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
