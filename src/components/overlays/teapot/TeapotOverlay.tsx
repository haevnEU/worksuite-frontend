import React, { useEffect, useState } from "react";
import {
  X,
  CupSoda,
  Flame,
  Clock,
  PartyPopper,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { TeapotStatusBadge } from "./TeapotStatusBadge.tsx";
import { TeapotHeader } from "./TeapotHeader.tsx";
import { TeapotDetailsSection } from "./TeapotDetailsSection.tsx";

interface TeapotOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type TeaBrewStep =
  "IDLE" | "HEATING" | "STEEPING" | "READY" | "DRINKING" | "FINISHED";

export const TeapotOverlay: React.FC<TeapotOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<TeaBrewStep>("IDLE");

  useEffect(() => {
    if (isOpen) {
      setStep("IDLE");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    switch (step) {
      case "IDLE":
        setStep("HEATING");
        setTimeout(() => {
          setStep("STEEPING");
        }, 1500);
        setTimeout(() => {
          setStep("READY");
        }, 3200);
        break;

      case "READY":
        setStep("DRINKING");
        setTimeout(() => {
          setStep("FINISHED");
        }, 1400);
        break;

      case "FINISHED":
        setStep("IDLE");
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    setStep("IDLE");
    onClose();
  };

  const isTransitioning =
    step === "HEATING" || step === "STEEPING" || step === "DRINKING";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900/95 border border-amber-500/30 rounded-2xl p-6 md:p-8 shadow-2xl shadow-amber-500/10 flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Close Easter Egg"
        >
          <X className="w-4 h-4" />
        </button>

        <TeapotStatusBadge />
        <TeapotHeader />
        <TeapotDetailsSection />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isTransitioning}
            className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              isTransitioning
                ? "bg-amber-950/60 text-amber-300/80 border border-amber-800/50 cursor-not-allowed"
                : step === "READY"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/25 animate-pulse"
                  : step === "FINISHED"
                    ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 shadow-amber-500/10"
                    : "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-amber-600/25"
            }`}
          >
            {step === "IDLE" && (
              <>
                <CupSoda className="w-4 h-4" />
                <span>Brew Fresh Tea</span>
              </>
            )}

            {step === "HEATING" && (
              <>
                <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
                <span>Heating water to 95°C...</span>
              </>
            )}

            {step === "STEEPING" && (
              <>
                <Clock className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Steeping Earl Grey leaves...</span>
              </>
            )}

            {step === "READY" && (
              <>
                <PartyPopper className="w-4 h-4 text-amber-200" />
                <span>Ready! Take first sip 🫖</span>
              </>
            )}

            {step === "DRINKING" && (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>*Slurp*... Delightful! ✨</span>
              </>
            )}

            {step === "FINISHED" && (
              <>
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Brew another cup?</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
          >
            Back to Work
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeapotOverlay;
