import React, { useState } from "react";
import { Monitor, Plus, Presentation, Trash2, X } from "lucide-react";
import { ReviewModel } from "../../models/review.model.ts";
import { ReviewType } from "../../types/review.type.ts";

interface ReviewModalProps {
  reviewToEdit?: ReviewModel | null;
  onClose: () => void;
  onSave: (
    reviewData: Omit<ReviewModel, "id" | "isArchived" | "createdAt">,
  ) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  reviewToEdit,
  onClose,
  onSave,
}) => {
  const [ticketNumber, setTicketNumber] = useState(
    reviewToEdit?.ticketNumber || "",
  );
  const [title, setTitle] = useState(reviewToEdit?.title || "");
  const [description, setDescription] = useState(
    reviewToEdit?.description || "",
  );
  const [reviewType, setReviewType] = useState<ReviewType>(
    reviewToEdit?.type || "DEMO",
  );

  // Dynamic fields
  const [demoNotes, setDemoNotes] = useState(reviewToEdit?.demoNotes || "");
  const [keyFacts, setKeyFacts] = useState<string[]>(
    reviewToEdit?.keyFacts && reviewToEdit.keyFacts.length > 0
      ? reviewToEdit.keyFacts
      : [""],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddKeyFact = () => setKeyFacts([...keyFacts, ""]);

  const handleKeyFactChange = (index: number, value: string) => {
    const updated = [...keyFacts];
    updated[index] = value;
    setKeyFacts(updated);
  };

  const handleRemoveKeyFact = (index: number) => {
    setKeyFacts(keyFacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedTicket = ticketNumber.startsWith("#")
      ? ticketNumber
      : `#${ticketNumber.trim()}`;

    await onSave({
      ticketNumber: formattedTicket,
      title,
      description,
      type: reviewType,
      demoNotes: reviewType === "DEMO" ? demoNotes : undefined,
      keyFacts:
        reviewType === "PRESENTATION"
          ? keyFacts.filter((k) => k.trim() !== "")
          : undefined,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 font-sans text-xs">
      <div className="w-[85vw] max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5 text-white font-extrabold text-base">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-400">
              {reviewType === "DEMO" ? (
                <Monitor className="w-5 h-5" />
              ) : (
                <Presentation className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2>{reviewToEdit ? "Edit Review" : "Create New Review"}</h2>
              <p className="text-xs text-slate-400 font-normal">
                {reviewType === "DEMO"
                  ? "Live Demo Protocol & Notes"
                  : "Presentation Slide Keyfacts"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="block font-bold text-slate-200">
                  Ticket Number *
                </label>
                <input
                  type="text"
                  required
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="e.g. 1234 or #1234"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="block font-bold text-slate-200">
                  Review Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Feature or sprint review title..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 text-sm block">
                  Review Format
                </span>
                <span className="text-slate-400 text-[11px]">
                  Choose between an interactive Live Demo or a Presentation
                  Slide.
                </span>
              </div>

              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setReviewType("DEMO")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    reviewType === "DEMO"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReviewType("PRESENTATION")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    reviewType === "PRESENTATION"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Presentation</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
              <label className="block font-bold text-slate-200">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the implemented scope..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {reviewType === "DEMO" && (
              <div className="space-y-1.5 p-3.5 bg-indigo-950/20 rounded-xl border border-indigo-900/40 animate-in fade-in duration-200">
                <label className="flex items-center space-x-2 font-bold text-indigo-300">
                  <Monitor className="w-4 h-4 text-indigo-400" />
                  <span>Live Demo Steps & Notes</span>
                </label>
                <textarea
                  rows={4}
                  value={demoNotes}
                  onChange={(e) => setDemoNotes(e.target.value)}
                  placeholder="1. Login with demo user&#10;2. Open dashboard&#10;3. Trigger passkey prompt..."
                  className="w-full bg-slate-950 border border-indigo-900/60 rounded-xl p-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            )}

            {reviewType === "PRESENTATION" && (
              <div className="space-y-3 p-4 bg-purple-950/20 rounded-xl border border-purple-900/40 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 font-bold text-purple-300">
                    <Presentation className="w-4 h-4 text-purple-400" />
                    <span>Slide Keyfacts</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddKeyFact}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 rounded-lg border border-purple-700/50 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Fact</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {keyFacts.map((fact, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-5 text-center text-slate-500 font-mono text-[10px]">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        value={fact}
                        onChange={(e) =>
                          handleKeyFactChange(index, e.target.value)
                        }
                        placeholder={`Keyfact #${index + 1}`}
                        className="flex-1 bg-slate-950 border border-purple-900/50 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      />
                      {keyFacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyFact(index)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/90 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              <span>{isSubmitting ? "Saving..." : "Save Review"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
