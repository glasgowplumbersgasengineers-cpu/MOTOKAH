import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, EASE, RADIUS, SHADOW } from "../../design";
import { PhoneFrame } from "../../components/PhoneFrame";
import { Cursor } from "../../components/Cursor";
import { TypingText } from "../../components/TypingText";

// Real quick-pick makes — matches topEastAfricaMakes in src/pages/SellCar.tsx,
// not an invented list.
const MAKES = ["Toyota", "Nissan", "Subaru", "Honda", "Mercedes-Benz", "BMW", "Mitsubishi", "Land Rover"];

const F = {
  makeOpen: 20,
  makeTap: 40,
  modelType: 60,
  yearType: 95,
  priceType: 115,
  photoTap: 150,
  photosIn: 165,
  publishTap: 195,
  success: 210,
};

function Field({ label, children, active }: { label: string; children: React.ReactNode; active?: boolean }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: COLOR.inkMute, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{
        background: COLOR.bg, border: `1px solid ${active ? COLOR.brand : COLOR.border}`,
        borderRadius: RADIUS.sm, padding: "8px 10px", fontSize: 11, color: COLOR.ink, fontFamily: "Inter, sans-serif",
        minHeight: 16,
      }}>
        {children}
      </div>
    </div>
  );
}

export function Chapter3PostAd() {
  const frame = useCurrentFrame();
  const sheetOpen = frame >= F.makeOpen && frame < F.makeTap + 10;
  const makeChosen = frame >= F.makeTap + 10 ? "Toyota" : "";
  const showSuccess = frame >= F.success;

  const formOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const successOpacity = interpolate(frame, [F.success, F.success + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outExpo });

  return (
    <AbsoluteFill style={{ background: COLOR.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PhoneFrame width={280} height={560}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: formOpacity }}>
          <div style={{
            background: COLOR.bg, padding: "16px 14px 10px", borderBottom: `1px solid ${COLOR.border}`,
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>
              Post Your Vehicle
            </div>
          </div>

          {showSuccess ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: successOpacity, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
                Listing submitted!
              </div>
              <div style={{ fontSize: 10, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif" }}>
                Ready for review. Live once verified.
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, padding: "12px 14px", overflow: "hidden" }}>
              <Field label="Make (Brand)" active={frame >= F.makeOpen && frame < F.makeTap + 10}>
                {makeChosen || <span style={{ color: COLOR.inkMute }}>Select make…</span>}
              </Field>
              <Field label="Model" active={frame >= F.modelType && frame < F.yearType}>
                {frame >= F.modelType ? <TypingText text="Corolla" startFrame={F.modelType} charsPerFrame={0.6} /> : null}
              </Field>
              <Field label="Year of Manufacture" active={frame >= F.yearType && frame < F.priceType}>
                {frame >= F.yearType ? <TypingText text="2020" startFrame={F.yearType} charsPerFrame={0.5} /> : null}
              </Field>
              <Field label="Asking Price" active={frame >= F.priceType && frame < F.photoTap}>
                {frame >= F.priceType ? <TypingText text="TZS 15,000,000" startFrame={F.priceType} charsPerFrame={0.7} /> : null}
              </Field>

              <div style={{ fontSize: 8, fontWeight: 700, color: COLOR.inkMute, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, marginTop: 4 }}>
                Photos
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {frame >= F.photosIn && [0, 1, 2].map((i) => {
                  const op = interpolate(frame, [F.photosIn + i * 6, F.photosIn + i * 6 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <div key={i} style={{ width: 44, height: 44, borderRadius: RADIUS.sm, background: "linear-gradient(135deg,#dce8f5,#c3d9ee)", opacity: op, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      🚗
                    </div>
                  );
                })}
                {frame < F.photosIn && (
                  <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, border: `1.5px dashed ${COLOR.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: COLOR.inkMute }}>
                    📷
                  </div>
                )}
              </div>

              <div style={{
                marginTop: 16, background: frame >= F.publishTap ? COLOR.brandInk : COLOR.brand,
                color: "#fff", borderRadius: RADIUS.md, padding: "11px", textAlign: "center",
                fontSize: 12, fontWeight: 700, fontFamily: "Inter, sans-serif", boxShadow: SHADOW.card,
              }}>
                Post Listing Now
              </div>
            </div>
          )}
        </div>
      </PhoneFrame>

      {sheetOpen && (
        <div style={{
          position: "absolute", left: "50%", bottom: 90, transform: "translateX(-50%)",
          width: 240, background: COLOR.surface, borderRadius: RADIUS.lg, boxShadow: SHADOW.lift,
          padding: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
        }}>
          {MAKES.map((m) => (
            <div key={m} style={{
              fontSize: 10, fontFamily: "Inter, sans-serif", padding: "7px 8px", borderRadius: RADIUS.sm,
              background: m === "Toyota" && frame >= F.makeTap ? COLOR.brandSoft : "transparent",
              color: m === "Toyota" && frame >= F.makeTap ? COLOR.brandInk : COLOR.ink,
              fontWeight: m === "Toyota" && frame >= F.makeTap ? 700 : 500,
            }}>
              {m}
            </div>
          ))}
        </div>
      )}

      <Cursor
        path={[
          { frame: F.makeOpen - 15, x: 500, y: 400 },
          { frame: F.makeOpen, x: 460, y: 300 },
          { frame: F.makeTap - 10, x: 440, y: 480 },
          { frame: F.makeTap, x: 440, y: 480 },
          { frame: F.photoTap - 15, x: 440, y: 480 },
          { frame: F.photoTap, x: 420, y: 560 },
          { frame: F.publishTap - 10, x: 420, y: 560 },
          { frame: F.publishTap, x: 460, y: 640 },
        ]}
        clickFrame={F.makeTap}
        hideFrame={F.success}
      />
    </AbsoluteFill>
  );
}

export const CHAPTER3_DURATION = 230;
