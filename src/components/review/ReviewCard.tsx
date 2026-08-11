import React from "react";
import {
  ExternalLink,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit2,
  Monitor,
  Presentation,
  CheckCircle2,
} from "lucide-react";
import { ReviewModel } from "../../models/review.model.ts";

interface ReviewCardProps {
  review: ReviewModel;
  onOpenCard: (review: ReviewModel) => void;
  onEdit: (review: ReviewModel) => void;
  onArchiveToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onOpenCard,
  onEdit,
  onArchiveToggle,
  onDelete,
}) => {
  const isDemo = review.type === "DEMO";

  return (
    <div
      onClick={() => onOpenCard(review)}
      className="group bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all space-y-4 flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a
              href={review.ticketUrl || `#${review.ticketNumber}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()} // Stoppt Klick auf das Ticket-Link
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-400 hover:text-indigo-300 border border-slate-800 font-mono font-bold text-xs flex items-center space-x-1 transition-colors"
            >
              <span>{review.ticketNumber}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1 ${
                isDemo
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  : "bg-purple-500/10 text-purple-400 border-purple-500/20"
              }`}
            >
              {isDemo ? (
                <Monitor className="w-3 h-3" />
              ) : (
                <Presentation className="w-3 h-3" />
              )}
              <span>{isDemo ? "Live Demo" : "Presentation"}</span>
            </span>
          </div>

          <span className="text-[10px] text-slate-500 font-mono">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
            {review.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {review.description}
          </p>
        </div>

        {isDemo && review.demoNotes && (
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
              Demo Steps (Click to view)
            </span>
            <p className="line-clamp-2 leading-normal">{review.demoNotes}</p>
          </div>
        )}

        {!isDemo && review.keyFacts && review.keyFacts.length > 0 && (
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              Slide Keyfacts (Click for slides)
            </span>
            <ul className="space-y-1">
              {review.keyFacts.slice(0, 2).map((fact, i) => (
                <li
                  key={i}
                  className="flex items-start space-x-2 text-xs text-slate-300 truncate"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span className="truncate">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs"
        onClick={(e) => e.stopPropagation()} // Stoppt Klick auf die Action Buttons
      >
        <button
          type="button"
          onClick={() => onArchiveToggle(review.id)}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer text-[11px]"
        >
          {review.isArchived ? (
            <>
              <ArchiveRestore className="w-3.5 h-3.5" />
              <span>Unarchive</span>
            </>
          ) : (
            <>
              <Archive className="w-3.5 h-3.5" />
              <span>Archive</span>
            </>
          )}
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onEdit(review)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Edit Review"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(review.id)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors cursor-pointer"
            title="Delete Review"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
