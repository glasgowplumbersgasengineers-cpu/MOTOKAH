import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { IconHeart, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface WishlistItem {
  id: string;
  listing_id: string;
  listing: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    currency: string;
    city: string | null;
  };
}

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("wishlist")
      .select("id, listing_id, listing:listings(id, title, make, model, year, price, currency, city)")
      .eq("user_id", user.id)
      .then(({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setItems((data as any) || []);
        setLoading(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    await supabase.from("wishlist").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <IconHeart size={24} className="text-primary" /> My Wishlist
        </h1>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">Your wishlist is empty.</p>
            <Link to="/search"><Button>Browse Cars</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <Link to={`/listing/${item.listing.id}`} className="flex-1">
                  <p className="font-semibold text-foreground hover:text-primary text-sm">{item.listing.title}</p>
                  <p className="text-xs text-muted-foreground">{item.listing.currency} {item.listing.price.toLocaleString()} • {item.listing.city || "—"}</p>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                  <IconTrash size={16} className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
