import { IconPhone, IconMessage, IconStarFilled, IconShieldCheck, IconUser, IconBuildingStore, IconExternalLink } from "@tabler/icons-react";
import { type Listing } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePriceFormatter } from "@/lib/prices";
import { toast } from "sonner";
import { isRealUuid } from "@/lib/uuid";

interface SellerCardProps {
  listing: Listing;
}

export default function SellerCard({ listing }: SellerCardProps) {
  const isDealer = listing.sellerType === "dealer";
  const { user } = useAuth();
  const navigate = useNavigate();
  const priceFormatter = usePriceFormatter();

  const phone = listing.sellerPhone || "";

  const handleCall = () => {
    if (phone) window.open(`tel:${phone}`);
  };

  const handleMessage = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!listing.sellerId) return;

    // Scraped dealers (Instagram/Jiji) get a synthetic sellerId like
    // "dealer-al_husnainmotors", not a real auth.users UUID — there's no
    // real account to message. conversations.participant2_id is a uuid
    // column, so inserting one of these threw a silent 400 (22P02) that was
    // only console.error'd, with zero user feedback. Found live 2026-11-12.
    if (!isRealUuid(listing.sellerId)) {
      toast.error("In-app messaging isn't available for this dealer yet — use WhatsApp or call below.");
      return;
    }

    // Check existing conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${listing.sellerId}),and(participant1_id.eq.${listing.sellerId},participant2_id.eq.${user.id})`)
      .eq("listing_id", listing.id)
      .maybeSingle();

    if (existing) {
      navigate(`/messages`);
      return;
    }

    const { data: newConvo, error: convoErr } = await supabase
      .from("conversations")
      .insert({ participant1_id: user.id, participant2_id: listing.sellerId, listing_id: listing.id })
      .select("id")
      .single();

    if (convoErr) {
      console.error("Could not start conversation:", convoErr.message);
      toast.error("Couldn't start the conversation. Try again in a moment.");
      return;
    }
    if (newConvo) navigate(`/messages`);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
          {listing.sellerName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold">{listing.sellerName}</h4>
            {isDealer && <IconShieldCheck size={16} stroke={2.5} className="text-success" />}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {isDealer ? (
              <>
                {listing.sellerRating != null && (
                  <>
                    <IconStarFilled size={14} className="text-accent" />
                    <span className="font-medium">{listing.sellerRating}</span>
                  </>
                )}
                <span>• Dealer • {listing.sellerListingCount} listings</span>
              </>
            ) : (
              <>
                <IconUser size={14} stroke={2.5} />
                <span>Private Seller</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {listing.id?.startsWith("jiji-") && listing.sourceUrl ? (
          <>
            <a href={listing.sourceUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors">
              <IconExternalLink size={18} stroke={2.5} />
              View on Jiji
            </a>
            <p className="text-[11px] text-center text-muted-foreground">This listing is from Jiji. Contact seller on their platform.</p>
          </>
        ) : (
          <>
            {/* Primary CTA: keep contact on-platform (in-app chat, not an external app handoff) */}
            <button onClick={handleMessage} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors">
              <IconMessage size={18} stroke={2.5} />
              Message on Motokah
            </button>
            {/* Secondary fallback only — phone call still leaves the app, so it's demoted below the in-app option */}
            <button onClick={handleCall} disabled={!phone} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border hover:bg-muted/50 text-xs font-medium text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <IconPhone size={14} stroke={2.5} />
              {phone ? "Or call seller" : "Phone pending"}
            </button>
          </>
        )}
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-sm text-muted-foreground">Asking Price</p>
        <p className="text-2xl font-bold text-primary">
          {priceFormatter.format(listing.price, listing.currency)}
        </p>
        {listing.originalPrice && (
          <p className="text-sm text-muted-foreground line-through">
            {priceFormatter.format(listing.originalPrice, listing.currency)}
          </p>
        )}
      </div>

      {isDealer && (
        <Link
          to={`/dealer/${listing.sellerId || "dealer-mgayamotors"}`}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
        >
          <IconBuildingStore size={14} stroke={2} />
          View Dealer Profile
        </Link>
      )}
    </div>
  );
}
