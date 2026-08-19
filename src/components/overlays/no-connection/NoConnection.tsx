import React, { useEffect, useState } from "react";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge.tsx";
import { NoConnectionHeader } from "./NoConnectionHeader.tsx";
import { ConnectionRetrySection } from "./ConnectionRetrySection.tsx";
import { TroubleshootingSteps } from "./TroubleshootingSteps.tsx";

interface NoConnectionPageProps {}

export const NoConnectionPage: React.FC<NoConnectionPageProps> = ({}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b111e]">
        <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans bg-[#0b111e] text-slate-200 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#10192c]/80 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        <ConnectionStatusBadge />
        <NoConnectionHeader />
        <ConnectionRetrySection />
        <TroubleshootingSteps />
      </div>
    </div>
  );
};
