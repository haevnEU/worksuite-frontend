import React, { useCallback, useEffect, useState } from "react";
import { Archive, Layers, Loader2, Plus } from "lucide-react";
import { CreateReviewRequest, ReviewModel } from "../models/review.model.ts";
import {
  DemoNotesModal,
  PresentationWindowModal,
  ReviewCard,
  ReviewModal,
} from "../components/review";
import { ReviewTab } from "../types/review.type.ts";
import { reviewService } from "../services/network/review.service.ts";

export const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReviewTab>("active");
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewModel | null>(null);

  const [selectedDemoReview, setSelectedDemoReview] =
    useState<ReviewModel | null>(null);
  const [selectedPresentationReview, setSelectedPresentationReview] =
    useState<ReviewModel | null>(null);

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

  const handleOpenCard = (review: ReviewModel) => {
    if (review.type === "DEMO") {
      setSelectedDemoReview(review);
    } else {
      setSelectedPresentationReview(review);
    }
  };

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

  const handleToggleArchive = async (id: string) => {
    await reviewService.toggleArchive(id);
    await loadReviews();
  };

  const handleDelete = async (id: string) => {
    await reviewService.deleteById(id);
    await loadReviews();
  };

  const handleOpenEdit = (review: ReviewModel) => {
    setEditingReview(review);
    setIsCreateEditModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Sprint & Feature Reviews
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Protocols
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage live demo scripts, presentation slide keyfacts, and ticket
              protocols
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingReview(null);
            setIsCreateEditModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer shrink-0 self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Review</span>
        </button>
      </div>

      <div className="flex bg-[#10192c]/80 p-1.5 rounded-xl border border-slate-800 w-fit gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Active Reviews</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("archived")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "archived"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-16 flex flex-col items-center justify-center space-y-3 text-slate-400 shadow-lg backdrop-blur">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-xs font-semibold">Loading reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-xs shadow-lg backdrop-blur">
          {activeTab === "active"
            ? "No active reviews present. Click 'New Review' to create one."
            : "No archived reviews."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {selectedDemoReview && (
        <DemoNotesModal
          review={selectedDemoReview}
          onClose={() => setSelectedDemoReview(null)}
          onSaveNotes={handleSaveDemoNotes}
        />
      )}

      {selectedPresentationReview && (
        <PresentationWindowModal
          review={selectedPresentationReview}
          onClose={() => setSelectedPresentationReview(null)}
        />
      )}
    </div>
  );
};
