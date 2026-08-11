import React from "react";

export const TroubleshootingSteps: React.FC = () => {
  return (
    <div className="w-full bg-[#0b111e] border border-slate-800 rounded-xl p-5 mb-5 text-left shadow-inner">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800/80 pb-2 mb-3">
        Troubleshooting Steps
      </span>
      <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
        <li>Verify your local internet connection.</li>
        <li>Ensure the backend service container is running properly.</li>
      </ul>
    </div>
  );
};
