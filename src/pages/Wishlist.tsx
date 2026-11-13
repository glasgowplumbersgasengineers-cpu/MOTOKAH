import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { mockListings } from "@/data/mockData";
import { isRealUuid } from "@/lib/uuid";
import { IconHeart, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface WishlistListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  year: number;
  city?: string | null;
}

export default function Wishlist() {
  const { user } = useAuth();
  // Previously this page queried Supabase's "wishlist" table directly, joined
  // only to the real "listings" table — it never saw scraped/mock listings
  // (which live in mockData.ts, not that table) and never used the shared
  // useWishlist() context, so a locally-saved scraped listing never appeared
  // here even after the hook itself was fixed to persist it. Found live
  // 2026-11-13. Now uses the same mock-first-then-DB resolution already
  // working correctly in Profile.tsx's "Saved" tab.
  const { wishlistIds, toggle } = useWishlist();
  const [listings, setListings] = useState<WishlistListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (wishlistIds.size === 0) { setListings([]); setLoading(false); return; }

    const ids = Array.from(wishlistIds);
    const fromMock = mockListings
      .filter((l) => ids.includes(l.id))
      .map((l) => ({ id: l.id, title: l.title, price: l.price, currency: l.currency, year: l.year, city: l.location }));
    const mockIds = new Set(fromMock.map((l) => l.id));
    const remainingIds = ids.filter((id) => !mockIds.has(id) && isRealUuid(id));

    if (remainingIds.length === 0) { setListings(fromMock); setLoading(false); return; }

    supabase.from("listings").select("id, title, price, currency, year, city").in("id", remainingIds).then(({ data }) => {
      const fromDb = (data || []).map((l) => ({ id: l.id, title: l.title, price: Number(l.price), currency: l.currency, year: l.year, city: l.city }));
      setListings([...fromMock, ...fromDb]);
      setLoading(false);
    });
  }, [user, wishlistIds]);

  const remove = async (id: string) => {
    await toggle(id);
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
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">Your wishlist is empty.</p>
            <Link to="/search"><Button>Browse Cars</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <Link to={`/listing/${item.id}`} className="flex-1">
                  <p className="font-semibold text-foreground hover:text-primary text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.currency} {item.price.toLocaleString()} • {item.city || "—"}</p>
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
