import React, { useState, useEffect, useCallback } from "react";
import { Plus, Archive, Layers, Loader2 } from "lucide-react";
import { ReviewModel, CreateReviewRequest } from "../models/review.model.ts";
import { ReviewCard } from "../components/review/ReviewCard.tsx";
import { ReviewModal } from "../components/review/ReviewModal.tsx";
import { DemoNotesModal } from "../components/review/DemoNotesModal.tsx";
import { PresentationWindowModal } from "../components/review/PresentationWindowModal.tsx";
import { ReviewTab } from "../types/review.type.ts";
import { reviewService } from "../services/network/review.service.ts";

export const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReviewTab>("active");
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals / Overlays State
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewModel | null>(null);

  // Klick-Aktionen auf Karten (Live Demo vs. Präsentation)
  const [selectedDemoReview, setSelectedDemoReview] =
    useState<ReviewModel | null>(null);
  const [selectedPresentationReview, setSelectedPresentationReview] =
    useState<ReviewModel | null>(null);

  /**
   * Lädt die Reviews aus dem Backend basierend auf dem aktiven Tab.
   */
  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    const isArchivedTab = activeTab === "archived";
    const data = await reviewService.fetchAll(isArchivedTab);
    setReviews(data);
    setIsLoading(false);
  }, [activeTab]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  /**
   * Klick auf eine Review-Karte schaltet zwischen Demo-Notes-Modal
   * und Präsentations-Window-Modal um.
   */
  const handleOpenCard = (review: ReviewModel) => {
    if (review.type === "DEMO") {
      setSelectedDemoReview(review);
    } else {
      setSelectedPresentationReview(review);
    }
  };

  /**
   * Erstellt ein neues Review oder aktualisiert ein bestehendes via API.
   */
  const handleSaveReview = async (data: CreateReviewRequest) => {
    if (editingReview) {
      await reviewService.update(editingReview.id, data);
    } else {
      await reviewService.create(data);
    }

    setIsCreateEditModalOpen(false);
    setEditingReview(null);
    await loadReviews();
  };

  /**
   * Aktualisiert die Demo-Notizen direkt aus dem 80%-Live-Demo-Modal heraus.
   */
  const handleSaveDemoNotes = async (id: string, newNotes: string) => {
    if (!selectedDemoReview) return;

    const payload: CreateReviewRequest = {
      ticketNumber: selectedDemoReview.ticketNumber,
      title: selectedDemoReview.title,
      description: selectedDemoReview.description,
      type: selectedDemoReview.type,
      demoNotes: newNotes,
    };

    await reviewService.update(id, payload);
    setSelectedDemoReview(null);
    await loadReviews();
  };

  /**
   * Schaltet den Archiv-Status um (active <-> archived).
   */
  const handleToggleArchive = async (id: string) => {
    await reviewService.toggleArchive(id);
    await loadReviews();
  };

  /**
   * Löscht ein Review via API.
   */
  const handleDelete = async (id: string) => {
    await reviewService.deleteById(id);
    await loadReviews();
  };

  /**
   * Öffnet das Bearbeiten-Modal für ein ausgewähltes Review.
   */
  const handleOpenEdit = (review: ReviewModel) => {
    setEditingReview(review);
    setIsCreateEditModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans text-slate-100 max-w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-base font-extrabold text-white">
            Sprint & Feature Reviews
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage live demo scripts, presentation slide keyfacts, and ticket
            protocols
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingReview(null);
            setIsCreateEditModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Review</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "active"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Active Reviews</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("archived")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "archived"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived</span>
        </button>
      </div>

      {/* Loading Indicator or Cards Grid */}
      {isLoading ? (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-16 flex flex-col items-center justify-center space-y-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          <span className="text-xs font-bold">Loading reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-12 text-center text-slate-500 text-xs">
          {activeTab === "active"
            ? "No active reviews present. Click 'New Review' to create one."
            : "No archived reviews."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onOpenCard={handleOpenCard}
              onEdit={handleOpenEdit}
              onArchiveToggle={handleToggleArchive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal 1: Erstellen / Bearbeiten */}
      {isCreateEditModalOpen && (
        <ReviewModal
          reviewToEdit={editingReview}
          onClose={() => {
            setIsCreateEditModalOpen(false);
            setEditingReview(null);
          }}
          onSave={handleSaveReview}
        />
      )}

      {/* Modal 2: Live Demo Notes Ansicht (80% w&h) */}
      {selectedDemoReview && (
        <DemoNotesModal
          review={selectedDemoReview}
          onClose={() => setSelectedDemoReview(null)}
          onSaveNotes={handleSaveDemoNotes}
        />
      )}

      {/* Modal 3: Präsentations-Slide-Viewer & Popup-Steuerung */}
      {selectedPresentationReview && (
        <PresentationWindowModal
          review={selectedPresentationReview}
          onClose={() => setSelectedPresentationReview(null)}
        />
      )}
    </div>
  );
};

export default ReviewPage;
