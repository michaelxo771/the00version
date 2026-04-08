"use client";

import { useState } from "react";

export type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

type Props = {
  productId: string;
  initialReviews: Review[];
};

function StarRating({ rating, interactive = false, onChange }: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label={interactive ? "Select rating" : `Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          aria-label={interactive ? `${star} star${star !== 1 ? "s" : ""}` : undefined}
          aria-pressed={interactive ? rating >= star : undefined}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"}`}
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              (interactive ? hovered || rating : rating) >= star
                ? "text-[#C9A84C]"
                : "text-neutral-700"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, title: "", body: "" });

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.body || !form.rating) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      if (res.ok) {
        const newReview: Review = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setSuccess(true);
        setShowForm(false);
        setForm({ name: "", rating: 5, title: "", body: "" });
        setTimeout(() => setSuccess(false), 4000);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-t border-[#1a1a1a] pt-12 pb-8" aria-label="Customer reviews">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-1">Reviews</p>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {reviews.length > 0 ? `${avgRating.toFixed(1)} / 5` : "No reviews yet"}
            </h2>
            {reviews.length > 0 && (
              <>
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-neutral-600 text-sm">({reviews.length})</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={showForm ? "btn-outline-gold px-5 py-2.5 text-xs rounded-sm" : "btn-gold px-5 py-2.5 text-xs rounded-sm"}
          aria-expanded={showForm}
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-600/10 border border-green-600/30 rounded-sm px-5 py-4 mb-6 text-green-400 text-sm font-semibold" role="alert">
          Thanks for your review! It&apos;s been posted.
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6 mb-8 space-y-5"
          aria-label="Write a review"
        >
          <div>
            <label htmlFor="reviewName" className="block text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2">Your Name</label>
            <input
              id="reviewName"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              aria-required="true"
              placeholder="First name + last initial"
              className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2">Rating</p>
            <StarRating rating={form.rating} interactive onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
          </div>
          <div>
            <label htmlFor="reviewTitle" className="block text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2">Review Title</label>
            <input
              id="reviewTitle"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              aria-required="true"
              placeholder="Summarise your review"
              className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="reviewBody" className="block text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2">Your Review</label>
            <textarea
              id="reviewBody"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              required
              aria-required="true"
              rows={4}
              placeholder="What did you think of the product?"
              className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 text-sm px-4 py-3 rounded-sm outline-none transition-colors resize-none"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-gold px-8 py-3 text-sm rounded-sm font-bold uppercase tracking-[0.1em] disabled:opacity-60">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 && !showForm && (
        <div className="text-center py-12 text-neutral-600 text-sm">
          Be the first to review this product.
        </div>
      )}

      <div className="space-y-5">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5 hover:border-[#C9A84C]/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={review.rating} />
                  {review.verified && (
                    <span className="text-[9px] uppercase tracking-wider text-green-400/80 font-semibold" aria-label="Verified purchase">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-neutral-200">{review.title}</p>
              </div>
              <time className="text-[10px] text-neutral-700 flex-shrink-0 ml-4" dateTime={review.createdAt}>
                {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </time>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mt-2">{review.body}</p>
            <p className="text-[10px] text-neutral-700 mt-3">— {review.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
