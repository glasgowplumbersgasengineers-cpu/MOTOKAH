import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IconCircleCheck, IconCamera } from "@tabler/icons-react";
import { COLOR, EASE, RADIUS, SHADOW, SCREEN_SCALE } from "../../design";
import { FullBleedScreen } from "../../components/FullBleedScreen";
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
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <FullBleedScreen scale={SCREEN_SCALE}>
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
              <IconCircleCheck size={40} stroke={1.8} style={{ color: COLOR.brand, marginBottom: 10 }} />
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
                {frame >= F.photosIn && [1, 3, 5].map((photoNum, i) => {
                  const op = interpolate(frame, [F.photosIn + i * 6, F.photosIn + i * 6 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <img
                      key={i}
                      src={staticFile(`cars/hilux-white-2019-${photoNum}.jpg`)}
                      alt=""
                      style={{ width: 44, height: 44, borderRadius: RADIUS.sm, opacity: op, objectFit: "cover", display: "block" }}
                    />
                  );
                })}
                {frame < F.photosIn && (
                  <div style={{ width: 44, height: 44, borderRadius: RADIUS.sm, border: `1.5px dashed ${COLOR.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLOR.inkMute }}>
                    <IconCamera size={18} stroke={1.8} />
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

        {sheetOpen && (
          <div style={{
            position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)",
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
            { frame: F.makeOpen - 15, x: 0, y: 320 },
            { frame: F.makeOpen, x: -40, y: 220 },
            { frame: F.makeTap - 10, x: -60, y: 400 },
            { frame: F.makeTap, x: -60, y: 400 },
            { frame: F.photoTap - 15, x: -60, y: 400 },
            { frame: F.photoTap, x: -80, y: 480 },
            { frame: F.publishTap - 10, x: -80, y: 480 },
            { frame: F.publishTap, x: -40, y: 560 },
          ]}
          clickFrame={F.makeTap}
          hideFrame={F.success}
        />
      </FullBleedScreen>
    </AbsoluteFill>
  );
}

export const CHAPTER3_DURATION = 230;
