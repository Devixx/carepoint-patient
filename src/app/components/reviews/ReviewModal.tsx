"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
import { useSubmitReview } from "@/hooks/api";

interface ReviewModalProps {
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReviewModal({
  doctorId,
  doctorName,
  appointmentId,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const submitReview = useSubmitReview();

  const handleSubmit = async () => {
    if (rating === 0) return;
    await submitReview.mutateAsync({ doctorId, appointmentId, rating, comment: comment.trim() || undefined });
    onSuccess?.();
    onClose();
  };

  const stars = hovered || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-slate-500" />
        </button>

        <h2 className="text-xl font-bold text-slate-900 mb-1">Leave a Review</h2>
        <p className="text-sm text-slate-500 mb-6">
          How was your appointment with <span className="font-semibold text-slate-700">Dr. {doctorName}</span>?
        </p>

        {/* Star picker */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              className="transition-transform hover:scale-110"
            >
              {s <= stars ? (
                <StarIcon className="h-10 w-10 text-yellow-400" />
              ) : (
                <StarOutline className="h-10 w-10 text-slate-300" />
              )}
            </button>
          ))}
        </div>

        {rating > 0 && (
          <p className="text-center text-sm font-semibold text-slate-600 mb-4 -mt-3">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </p>
        )}

        {/* Comment */}
        <textarea
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
          placeholder="Share your experience (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
        />
        <p className="text-xs text-slate-400 text-right mb-4 -mt-2">{comment.length}/500</p>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={rating === 0 || submitReview.isPending}
            isLoading={submitReview.isPending}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}
