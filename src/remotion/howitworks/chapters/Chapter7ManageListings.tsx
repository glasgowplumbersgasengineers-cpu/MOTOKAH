import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, EASE, RADIUS, SHADOW } from "../../design";
import { PhoneFrame } from "../../components/PhoneFrame";
import { Cursor } from "../../components/Cursor";
import { TypingText } from "../../components/TypingText";

// Reflects the real Edit/Mark Sold/Delete buttons added to Profile.tsx's
// listing cards this session.
const F = { editTap: 20, formOpen: 35, priceEdit: 55, saveTap: 90, backToList: 105, soldTap: 140 };

export function Chapter7ManageListings() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const inEditForm = frame >= F.formOpen && frame < F.backToList;
  const priceUpdated = frame >= F.saveTap;
  const isSold = frame >= F.soldTap;

  return (
    <AbsoluteFill style={{ background: COLOR.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PhoneFrame width={280} height={560}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: fadeIn }}>
          <div style={{ background: COLOR.bg, padding: "16px 14px 10px", borderBottom: `1px solid ${COLOR.border}`, flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>
              {inEditForm ? "Edit Your Listing" : "My Listings"}
            </div>
          </div>

          <div style={{ flex: 1, padding: 14 }}>
            {inEditForm ? (
              <>
                <div style={{ fontSize: 8, fontWeight: 700, color: COLOR.inkMute, fontFamily: "Inter, sans-serif", textTransform: "uppercase", marginBottom: 3 }}>Asking Price</div>
                <div style={{ background: COLOR.bg, border: `1px solid ${frame >= F.priceEdit && frame < F.saveTap ? COLOR.brand : COLOR.border}`, borderRadius: RADIUS.sm, padding: "9px 10px", fontSize: 12, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 16 }}>
                  TZS {frame >= F.priceEdit ? <TypingText text="16,500,000" startFrame={F.priceEdit} charsPerFrame={0.6} /> : "15,000,000"}
                </div>
                <div style={{
                  background: frame >= F.saveTap - 5 ? COLOR.brandInk : COLOR.brand, color: "#fff", borderRadius: RADIUS.md,
                  padding: "11px", textAlign: "center", fontSize: 12, fontWeight: 700, fontFamily: "Inter, sans-serif", boxShadow: SHADOW.card,
                }}>
                  Save Changes
                </div>
              </>
            ) : (
              <div style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, borderRadius: RADIUS.lg, padding: 10 }}>
                <div style={{ height: 70, background: "linear-gradient(135deg,#dce8f5,#c3d9ee)", borderRadius: RADIUS.sm, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, position: "relative" }}>
                  🚗
                  <div style={{
                    position: "absolute", top: 5, left: 5, fontSize: 7, fontWeight: 800, color: "#fff",
                    background: isSold ? "#5A6572" : "#E6A23C", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase",
                  }}>
                    {isSold ? "Sold" : "Approved"}
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 2 }}>2020 Toyota Corolla</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: COLOR.brandInk, fontFamily: "Inter, sans-serif", marginBottom: 8 }}>
                  TZS {priceUpdated ? "16,500,000" : "15,000,000"}
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "Inter, sans-serif", border: `1px solid ${COLOR.border}`, borderRadius: RADIUS.sm, padding: "5px 9px", color: COLOR.ink }}>Edit</div>
                  <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "Inter, sans-serif", border: `1px solid ${isSold ? COLOR.border : "#2BAF6B"}`, borderRadius: RADIUS.sm, padding: "5px 9px", color: isSold ? COLOR.inkMute : "#2BAF6B" }}>
                    {isSold ? "Sold ✓" : "Mark as Sold"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </PhoneFrame>

      <Cursor
        path={[
          { frame: F.editTap - 10, x: 450, y: 480 },
          { frame: F.editTap, x: 450, y: 480 },
          { frame: F.priceEdit - 10, x: 500, y: 330 },
          { frame: F.saveTap - 10, x: 500, y: 480 },
          { frame: F.saveTap, x: 500, y: 480 },
          { frame: F.soldTap - 10, x: 540, y: 480 },
          { frame: F.soldTap, x: 540, y: 480 },
        ]}
        clickFrame={F.editTap}
        hideFrame={F.soldTap + 10}
      />
    </AbsoluteFill>
  );
}

export const CHAPTER7_DURATION = 170;
