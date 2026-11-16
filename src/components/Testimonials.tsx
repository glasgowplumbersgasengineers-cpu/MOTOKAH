import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IconStarFilled, IconQuote } from "@/components/icons";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, reviewer_id")
        .gte("rating", 4)
        .not("comment", "is", null)
        .order("rating", { ascending: false })
        .limit(3);

      if (!data || data.length === 0) { setLoading(false); return; }

      const reviewerIds = data.map((r) => r.reviewer_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", reviewerIds);
      const nameMap = new Map((profiles || []).map((p) => [p.user_id, p.display_name]));

      setReviews(
        data.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          reviewer_name: nameMap.get(r.reviewer_id) || "Happy Customer",
        }))
      );
      setLoading(false);
    };
    fetch();
  }, []);

  if (!loading && reviews.length === 0) return null;
  if (loading) return null;

  return (
    <section className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-2 text-center">What Our Users Say</h2>
      <p className="text-muted-foreground text-sm text-center mb-8">Real reviews from real buyers and sellers</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
            <IconQuote size={24} className="text-primary/40" />
            <p className="text-sm text-foreground leading-relaxed flex-1">"{r.comment}"</p>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-semibold text-foreground">{r.reviewer_name}</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <IconStarFilled key={i} size={14} className="text-accent" />
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
