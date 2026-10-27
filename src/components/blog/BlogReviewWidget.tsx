import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send, CheckCircle2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getStoredProfile, type UserProfile } from '@/lib/communityStore';

interface Review {
  id: string;
  userName: string;
  rating: number;
  reviewText?: string;
  createdAt: string;
}

interface BlogReviewWidgetProps {
  blogSlug: string;
  onRequireAuth?: () => void;
}

export default function BlogReviewWidget({ blogSlug, onRequireAuth }: BlogReviewWidgetProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUserProfile(getStoredProfile());
    // Load local stored reviews for this slug
    const saved = localStorage.getItem(`rr_reviews_${blogSlug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReviews(parsed);
        const prof = getStoredProfile();
        if (prof && parsed.some((r: Review) => r.userName === prof.name)) {
          setHasReviewed(true);
        }
      } catch {}
    } else {
      // Seed 2 default community reviews
      const initial: Review[] = [
        {
          id: '1',
          userName: 'Michael Vance',
          rating: 5,
          reviewText: 'Exceptional deep dive into modern AI search patterns. Applied these techniques directly to our pipeline.',
          createdAt: '2 days ago',
        },
        {
          id: '2',
          userName: 'Sarah Jenkins',
          rating: 5,
          reviewText: 'Very clear breakdown of GEO and schema protocols. A must-read for digital growth leaders.',
          createdAt: '5 days ago',
        }
      ];
      setReviews(initial);
      localStorage.setItem(`rr_reviews_${blogSlug}`, JSON.stringify(initial));
    }
  }, [blogSlug]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = getStoredProfile();
    if (!prof) {
      toast.error('Please sign in with Google or Email to submit a review.');
      if (onRequireAuth) onRequireAuth();
      return;
    }

    setSubmitting(true);

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      userName: prof.name || 'Verified Reader',
      rating,
      reviewText: reviewText.trim() || undefined,
      createdAt: 'Just now',
    };

    const updated = [newRev, ...reviews.filter(r => r.userName !== newRev.userName)];
    setReviews(updated);
    localStorage.setItem(`rr_reviews_${blogSlug}`, JSON.stringify(updated));
    setHasReviewed(true);
    setReviewText('');
    setSubmitting(false);
    toast.success('Thank you for your review!');
  };

  return (
    <div className="glass-card rounded-3xl border-white/10 p-6 sm:p-8 my-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-black text-foreground">{averageRating}</span>
            <div className="flex items-center text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? 'fill-primary text-primary' : 'text-white/20'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Based on {reviews.length} Community Reviews
          </p>
        </div>

        {!hasReviewed ? (
          <div className="text-right">
            <span className="text-xs font-bold text-muted-foreground block mb-1">Rate this article:</span>
            <div className="flex items-center gap-1 justify-end">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-primary transition-transform hover:scale-125"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'fill-primary text-primary' : 'text-white/20'}`}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <CheckCircle2 className="w-4 h-4" /> You reviewed this post
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      {!hasReviewed && (
        <form onSubmit={handleSubmitReview} className="mt-6 space-y-3">
          <div className="relative">
            <textarea
              rows={2}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts on this article (optional)..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="button-premium text-xs font-black uppercase tracking-wider px-5 py-2"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Review ({rating}★)
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="mt-8 space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary">
                  {rev.userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-foreground">{rev.userName}</span>
              </div>
              <div className="flex items-center text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-primary text-primary' : 'text-white/10'}`}
                  />
                ))}
              </div>
            </div>
            {rev.reviewText && (
              <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                {rev.reviewText}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
