import React, { useState } from "react";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge.tsx";
import { NoConnectionHeader } from "./NoConnectionHeader.tsx";
import { ConnectionRetrySection } from "./ConnectionRetrySection.tsx";
import { TroubleshootingSteps } from "./TroubleshootingSteps.tsx";

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-[#0b111e] text-slate-200">
      <div className="w-full max-w-2xl bg-[#10192c]/80 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur flex flex-col items-center text-center relative overflow-hidden">
        <ConnectionStatusBadge />
        <NoConnectionHeader />
        <ConnectionRetrySection isRetrying={isRetrying} onRetry={handleRetry} />
        <TroubleshootingSteps />
      </div>
    </div>
  );
};
