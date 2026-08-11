import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Presentation,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { ReviewModel } from "../../models/review.model.ts";

interface PresentationWindowModalProps {
  review: ReviewModel;
  onClose: () => void;
}

export const PresentationWindowModal: React.FC<
  PresentationWindowModalProps
> = ({ review, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [popupZoomLevel, setPopupZoomLevel] = useState<number>(100);
  const popupRef = useRef<Window | null>(null);

  const facts =
    review.keyFacts && review.keyFacts.length > 0
      ? review.keyFacts
      : ["No Keyfacts specified"];

  const totalSlides = facts.length;
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === totalSlides - 1;

  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  const syncPopup = (index: number, zoom: number) => {
    if (popupRef.current && !popupRef.current.closed) {
      if ((popupRef.current as any).setSlideIndex) {
        (popupRef.current as any).setSlideIndex(index);
      }
      if ((popupRef.current as any).setZoomLevel) {
        (popupRef.current as any).setZoomLevel(zoom);
      }
    }
  };

  const handleNext = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      syncPopup(nextIndex, popupZoomLevel);
    }
  }, [currentSlideIndex, totalSlides, popupZoomLevel]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      const prevIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIndex);
      syncPopup(prevIndex, popupZoomLevel);
    }
  }, [currentSlideIndex, popupZoomLevel]);

  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.min(Math.max(newZoom, 70), 200);
    setPopupZoomLevel(clamped);
    syncPopup(currentSlideIndex, clamped);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleOpenInNewWindow = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }

    const newWindow = window.open(
      "",
      `Presentation_${review.id}`,
      "width=1280,height=720,menubar=no,toolbar=no,location=no,status=no",
    );

    if (newWindow) {
      popupRef.current = newWindow;

      const factsJson = JSON.stringify(facts);
      const title = review.title.replace(/"/g, "&quot;");
      const ticketNumber = review.ticketNumber.replace(/"/g, "&quot;");
      const description = review.description.replace(/"/g, "&quot;");

      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>${ticketNumber} - ${title}</title>
            <style>
              :root {
                --zoom-factor: 1;
              }
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                background-color: #020617;
                color: #f8fafc;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: calc(2.5rem * var(--zoom-factor));
                overflow: hidden;
                user-select: none;
              }
              header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #1e293b;
                padding-bottom: calc(1.25rem * var(--zoom-factor));
                shrink: 0;
              }
              .ticket-badge {
                color: #c084fc;
                font-family: ui-monospace, monospace;
                font-weight: 700;
                font-size: calc(0.875rem * var(--zoom-factor));
                transition: font-size 0.15s ease;
              }
              .title {
                font-size: calc(1.5rem * var(--zoom-factor));
                font-weight: 900;
                color: #ffffff;
                margin-top: 0.25rem;
                transition: font-size 0.15s ease;
              }
              main {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 0 auto;
                width: 100%;
                text-align: center;
              }
              .card {
                background: #0f172a;
                border: 1px solid #1e293b;
                border-radius: 1.5rem;
                padding: calc(3.5rem * var(--zoom-factor));
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                width: 100%;
                max-width: calc(1000px * var(--zoom-factor));
                min-height: calc(260px * var(--zoom-factor));
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s ease;
              }
              .card-text {
                font-size: calc(2rem * var(--zoom-factor));
                font-weight: 800;
                line-height: 1.4;
                color: #f8fafc;
                transition: font-size 0.15s ease;
              }
              .description {
                color: #94a3b8;
                font-size: calc(0.875rem * var(--zoom-factor));
                margin-top: calc(1.75rem * var(--zoom-factor));
                max-width: calc(1000px * var(--zoom-factor));
                transition: font-size 0.15s ease;
              }
              footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #0f172a;
                padding-top: calc(1rem * var(--zoom-factor));
                color: #64748b;
                font-size: calc(0.75rem * var(--zoom-factor));
                shrink: 0;
                transition: font-size 0.15s ease;
              }
            </style>
          </head>
          <body>
            <header>
              <div>
                <span class="ticket-badge">${ticketNumber}</span>
                <h1 class="title">${title}</h1>
              </div>
            </header>

            <main>
              <div class="card">
                <p class="card-text" id="slideText"></p>
              </div>
            </main>

            <footer>
              <span>Worksuite Presentation</span>
              <span>Remote controlled from Dashboard</span>
            </footer>

            <script>
              const facts = ${factsJson};
              let currentIndex = ${currentSlideIndex};
              let currentZoom = ${popupZoomLevel};

              const slideText = document.getElementById('slideText');

              function render() {
                slideText.innerText = '"' + facts[currentIndex] + '"';
                document.documentElement.style.setProperty('--zoom-factor', currentZoom / 100);
              }

              window.setSlideIndex = function(index) {
                if (index >= 0 && index < facts.length) {
                  currentIndex = index;
                  render();
                }
              };

              window.setZoomLevel = function(zoom) {
                currentZoom = zoom;
                render();
              };

              render();
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 font-sans text-xs">
      <div className="w-[90vw] max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800 text-purple-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-purple-400 font-bold text-xs">
                  {review.ticketNumber}
                </span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-extrabold text-white">
                  {review.title}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold px-1.5 uppercase tracking-wider">
                Pop-up Zoom
              </span>

              <button
                type="button"
                onClick={() => handleZoomChange(popupZoomLevel - 10)}
                disabled={popupZoomLevel <= 70}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                title="Pop-up Page Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-[11px] font-bold text-slate-300 w-10 text-center select-none">
                {popupZoomLevel}%
              </span>

              <button
                type="button"
                onClick={() => handleZoomChange(popupZoomLevel + 10)}
                disabled={popupZoomLevel >= 200}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                title="Pop-up Page Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {popupZoomLevel !== 100 && (
                <button
                  type="button"
                  onClick={() => handleZoomChange(100)}
                  className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 cursor-pointer transition-colors"
                  title="Reset Pop-up Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-xs font-extrabold">
              Seite {currentSlideIndex + 1} / {totalSlides}
            </span>

            <button
              type="button"
              onClick={handleOpenInNewWindow}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <span>Open in New Window</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-950 p-8 flex flex-col items-center justify-center relative overflow-hidden space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <div className="p-8 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col justify-between min-h-[240px] overflow-hidden">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block shrink-0">
                Aktuelle Folie
              </span>
              <p className="text-xl font-black text-white leading-relaxed my-auto">
                "{facts[currentSlideIndex]}"
              </p>
            </div>

            <div className="p-8 bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl flex flex-col justify-between min-h-[240px] opacity-50 overflow-hidden">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block shrink-0">
                Nächste Folie
              </span>
              <p className="text-lg font-bold text-slate-300 leading-relaxed my-auto">
                {currentSlideIndex + 1 < totalSlides
                  ? `"${facts[currentSlideIndex + 1]}"`
                  : "— (Ende der Präsentation) —"}
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-xs text-center max-w-xl">
            {review.description}
          </p>

          {totalSlides > 1 && (
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirstSlide}
                className={`p-3.5 rounded-2xl border transition-all pointer-events-auto ${
                  isFirstSlide
                    ? "bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed opacity-30"
                    : "bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-white shadow-xl cursor-pointer hover:border-purple-500"
                }`}
                title={
                  isFirstSlide ? "Erste Folie" : "Vorherige Folie (Pfeil Links)"
                }
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLastSlide}
                className={`p-3.5 rounded-2xl border transition-all pointer-events-auto ${
                  isLastSlide
                    ? "bg-slate-950 text-slate-700 border-slate-900 cursor-not-allowed opacity-30"
                    : "bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-white shadow-xl cursor-pointer hover:border-purple-500"
                }`}
                title={
                  isLastSlide ? "Letzte Folie" : "Nächste Folie (Pfeil Rechts)"
                }
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
