import React from "react";
import { Loader2 } from "lucide-react";
import { ReviewModel } from "../../models/review.model.ts";
import { ReviewCard } from "./ReviewCard.tsx";
import { ReviewTab } from "../../types/review.type.ts";

interface ReviewGridProps {
  reviews: ReviewModel[];
  isLoading: boolean;
  activeTab: ReviewTab;
  onOpenCard: (review: ReviewModel) => void;
  onEdit: (review: ReviewModel) => void;
  onArchiveToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReviewGrid: React.FC<ReviewGridProps> = ({
  reviews,
  isLoading,
  activeTab,
  onOpenCard,
  onEdit,
  onArchiveToggle,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-16 flex flex-col items-center justify-center space-y-3 text-slate-400 shadow-lg backdrop-blur">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-xs font-semibold">Loading reviews...</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-xs shadow-lg backdrop-blur">
        {activeTab === "active"
          ? "No active reviews present. Click 'New Review' to create one."
          : "No archived reviews present."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onOpenCard={onOpenCard}
          onEdit={onEdit}
          onArchiveToggle={onArchiveToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
