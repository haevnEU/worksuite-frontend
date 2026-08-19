import React, { useCallback, useEffect, useState } from "react";
import { CreateReviewRequest, ReviewModel } from "../models/review.model.ts";
import {
  DemoNotesModal,
  PresentationWindowModal,
  ReviewHeader,
  ReviewModal,
  ReviewTabs,
  ReviewGrid,
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
      {/* Header mit Action-Button & Guide */}
      <ReviewHeader
        totalCount={reviews.length}
        onAddNewReview={() => {
          setEditingReview(null);
          setIsCreateEditModalOpen(true);
        }}
      />

      {/* Tabs */}
      <ReviewTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Card Grid / Loader / Empty-State */}
      <ReviewGrid
        reviews={reviews}
        isLoading={isLoading}
        activeTab={activeTab}
        onOpenCard={handleOpenCard}
        onEdit={handleOpenEdit}
        onArchiveToggle={handleToggleArchive}
        onDelete={handleDelete}
      />

      {/* Modals */}
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
