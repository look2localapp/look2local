"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, ShieldCheck } from "lucide-react";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
  verified: boolean;
  productTitle?: string | null;
}

interface DBReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  verifiedPurchase: boolean;
  customer: {
    name: string;
    profilePhoto: string | null;
  };
  product?: {
    title: string;
  } | null;
}

const SAMPLE_REVIEWS: Review[] = [
  { id: "r1", author: "Vijay K.", avatar: "V", rating: 5, date: "2 days ago", text: "Amazing shop! Got the PS5 at a great price. The staff was very helpful and the offer lock system worked perfectly. Saved ₹3,000 compared to online prices!", likes: 12, verified: true, productTitle: "Sony PlayStation 5 Disc Edition" },
  { id: "r2", author: "Priya M.", avatar: "P", rating: 4, date: "1 week ago", text: "Good selection of electronics. The bank offer for HDFC card was a great deal. Slight wait time but totally worth it.", likes: 8, verified: true, productTitle: "Apple AirPods Pro (2nd Gen)" },
  { id: "r3", author: "Rahul S.", avatar: "R", rating: 5, date: "2 weeks ago", text: "Best electronics shop in Hyderabad! Genuine products, excellent service. Used the L2L offer lock and it was honoured without any issues.", likes: 23, verified: false },
  { id: "r4", author: "Deepa A.", avatar: "D", rating: 3, date: "3 weeks ago", text: "Decent shop. Products are genuine but prices could be more competitive. The staff is knowledgeable.", likes: 4, verified: true },
];

const STARS = [5, 4, 3, 2, 1];

function StarRow({ n, count, total }: { n: number; count: number; total: number }) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-4 text-right">{n}</span>
      <Star className="w-3 h-3 text-amber-400 fill-current flex-shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-gray-400 w-5">{count}</span>
    </div>
  );
}

interface ReviewsSectionProps {
  shopName: string;
  avgRating?: number;
  totalReviews?: number;
  reviewsList?: DBReview[];
}

export default function ReviewsSection({ shopName, reviewsList }: ReviewsSectionProps) {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dbReviews = (reviewsList || []).map(r => ({
      id: r.id,
      author: r.customer.name,
      avatar: r.customer.name.charAt(0).toUpperCase(),
      rating: r.rating,
      date: new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      text: r.comment || "No comment left.",
      likes: 0,
      verified: r.verifiedPurchase,
      productTitle: r.product?.title || null
    }));
    
    setReviews([...dbReviews, ...SAMPLE_REVIEWS]);
  }, [reviewsList]);

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submitReview = () => {
    if (!newRating || !reviewText.trim()) return;
    const r: Review = {
      id: `r${Date.now()}`, author: "You", avatar: "Y", rating: newRating,
      date: "just now", text: reviewText.trim(), likes: 0, verified: true,
    };
    setReviews(prev => [r, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setNewRating(0);
    setReviewText("");
  };

  const displayTotalReviews = reviews.length;
  const displayAvgRating = parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1));

  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const floorRating = Math.floor(r.rating);
    if (dist[floorRating] !== undefined) {
      dist[floorRating]++;
    } else if (r.rating > 4 && r.rating < 5) {
      dist[4]++;
    }
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
          ⭐ Customer Reviews
          <span className="text-sm font-semibold text-gray-400">({displayTotalReviews})</span>
        </h2>
        {!showForm && !submitted && (
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
            Write Review
          </button>
        )}
      </div>

      <div className="flex gap-6 mb-6 p-4 bg-gray-50 rounded-2xl">
        <div className="text-center flex-shrink-0">
          <p className="text-5xl font-extrabold text-gray-900">{displayAvgRating.toFixed(1)}</p>
          <div className="flex gap-0.5 justify-center my-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-4 h-4 ${i <= Math.round(displayAvgRating) ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400">{displayTotalReviews} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {STARS.map(n => <StarRow key={n} n={n} count={dist[n] ?? 0} total={displayTotalReviews} />)}
        </div>
      </div>

      {showForm && (
        <div className="mb-5 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="font-bold text-gray-800 mb-3">Your Rating for {shopName}</p>
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(i => (
              <button key={i}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setNewRating(i)}
                className="transition-transform hover:scale-125">
                <Star className={`w-7 h-7 transition-colors ${i <= (hoverRating || newRating) ? "text-amber-400 fill-current" : "text-gray-300 fill-current"}`} />
              </button>
            ))}
          </div>
          <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3}
            placeholder="Share your experience with this shop…"
            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none mb-3" />
          <div className="flex gap-2">
            <button onClick={submitReview} disabled={!newRating || !reviewText.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
              Submit Review
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-3 rounded-xl text-sm text-green-700 font-semibold">
          ✅ Thank you for your review!
        </div>
      )}

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {r.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-sm text-gray-900">{r.author}</span>
                  {r.verified ? (
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Verified Purchase
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                      Regular Visit
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-1.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}`} />
                  ))}
                </div>
                {r.productTitle && (
                  <p className="text-[11px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                    🛍️ Bought: <span className="text-gray-700 font-extrabold">{r.productTitle}</span>
                  </p>
                )}
                <p className="text-sm text-gray-700 leading-relaxed mt-1">{r.text}</p>
                <button onClick={() => toggleLike(r.id)}
                  className={`mt-2 flex items-center gap-1.5 text-xs font-semibold transition-colors ${liked.has(r.id) ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                  <ThumbsUp className={`w-3.5 h-3.5 ${liked.has(r.id) ? "fill-current" : ""}`} />
                  Helpful ({r.likes + (liked.has(r.id) ? 1 : 0)})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
