import { useState, useEffect } from "react";
import { IconStarFilled, IconStar, IconCircleCheck } from "@/components/icons";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name: string;
  verified: boolean;
};

interface ReviewsSectionProps {
  sellerId: string;
  sellerName?: string;
  listingId?: string;
}

export default function ReviewsSection({ sellerId, sellerName, listingId }: ReviewsSectionProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const fetchReviews = async () => {
    setLoading(true);
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, reviewer_id")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (!reviewData || reviewData.length === 0) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const reviewerIds = reviewData.map((r) => r.reviewer_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, verified_at")
      .in("user_id", reviewerIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.user_id, p])
    );

    const mapped: Review[] = reviewData.map((r) => {
      const profile = profileMap.get(r.reviewer_id);
      return {
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        reviewer_name: profile?.display_name || "Anonymous",
        verified: !!profile?.verified_at,
      };
    });

    setReviews(mapped);

    if (user) {
      const mine = reviewData.find((r) => r.reviewer_id === user.id);
      setAlreadyReviewed(!!mine);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (sellerId) fetchReviews();
  }, [sellerId, user]);

  const handleSubmit = async () => {
    if (!user) { navigate("/auth"); return; }
    if (rating === 0) { toast.error("Please select a star rating."); return; }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      seller_id: sellerId,
      reviewer_id: user.id,
      listing_id: listingId || null,
      rating,
      comment: comment.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit review. You may have already reviewed this seller.");
    } else {
      toast.success("Review submitted!");
      setOpen(false);
      setRating(0);
      setComment("");
      fetchReviews();
    }
  };

  const canReview = user && user.id !== sellerId && !alreadyReviewed;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-bold">
          {sellerName ? `Reviews for ${sellerName}` : "Reviews"}
        </h3>
        <div className="flex items-center gap-3">
          {reviews.length > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <IconStarFilled size={16} className="text-accent" />
              <span className="font-semibold">{avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviews.length})</span>
            </div>
          )}
          {canReview && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">Leave a Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rate {sellerName || "this seller"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  {/* Star picker */}
                  <div>
                    <p className="text-sm font-medium mb-2">Your rating</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => {
                        const filled = i < (hovered || rating);
                        return (
                          <button
                            key={i}
                            type="button"
                            onMouseEnter={() => setHovered(i + 1)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(i + 1)}
                            className="focus:outline-none"
                          >
                            {filled ? (
                              <IconStarFilled size={28} className="text-accent" />
                            ) : (
                              <IconStar size={28} className="text-muted-foreground" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {rating > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                      </p>
                    )}
                  </div>
                  {/* Comment */}
                  <div>
                    <p className="text-sm font-medium mb-2">Comment (optional)</p>
                    <Textarea
                      placeholder="Share your experience with this seller..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{comment.length}/500</p>
                  </div>
                  <Button
                    className="w-full"
                    disabled={rating === 0 || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {user && user.id !== sellerId && alreadyReviewed && (
            <span className="text-xs text-muted-foreground italic">You've reviewed this seller</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center text-sm text-muted-foreground animate-pulse">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No reviews yet.{canReview ? " Be the first to leave one!" : ""}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {reviews.map((r) => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {r.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{r.reviewer_name}</span>
                      {r.verified && (
                        <IconCircleCheck size={14} stroke={2.5} className="text-success" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <IconStarFilled
                      key={i}
                      size={12}
                      className={i < r.rating ? "text-accent" : "text-muted"}
                    />
                  ))}
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
