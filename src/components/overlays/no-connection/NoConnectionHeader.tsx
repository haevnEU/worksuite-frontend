import React from "react";
import { WifiOff } from "lucide-react";

export const NoConnectionHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="p-5 bg-[#0b111e] border border-slate-800 rounded-2xl text-slate-400 mb-6 shadow-inner">
        <WifiOff className="w-12 h-12 text-slate-500 stroke-[1.75]" />
      </div>

      <div className="max-w-md space-y-2 mb-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Unable to Connect to Server
        </h2>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
          We couldn't establish a connection to the backend service API.
        </p>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
          Please check your network connection.
        </p>
      </div>
    </div>
  );
};
