import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IconSearch } from "@tabler/icons-react";
import { COLOR, EASE, RADIUS, SHADOW, SCREEN_SCALE } from "../../design";
import { FullBleedScreen } from "../../components/FullBleedScreen";
import { Cursor } from "../../components/Cursor";
import { TypingText } from "../../components/TypingText";
import { VehicleCard } from "../../components/VehicleCard";

const F = { typeStart: 15, filtersOpen: 60, makeTap: 85, applyTap: 110, resultsIn: 125, openListing: 165 };

export function Chapter2Search() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const filtersVisible = frame >= F.filtersOpen && frame < F.applyTap + 8;
  const makeChosen = frame >= F.makeTap;
  const resultsVisible = frame >= F.resultsIn && frame < F.openListing;
  const detailVisible = frame >= F.openListing;
  const resultsOp = interpolate(frame, [F.resultsIn, F.resultsIn + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const detailOp = interpolate(frame, [F.openListing, F.openListing + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <FullBleedScreen scale={SCREEN_SCALE}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: fadeIn }}>
          <div style={{ background: COLOR.bg, padding: "16px 14px 10px", borderBottom: `1px solid ${COLOR.border}`, flexShrink: 0 }}>
            <div style={{
              background: COLOR.surface, border: `1px solid ${frame >= 0 && frame < F.filtersOpen ? COLOR.brand : COLOR.border}`,
              borderRadius: RADIUS.md, padding: "9px 12px", fontSize: 11, color: COLOR.ink, fontFamily: "Inter, sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <IconSearch size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              {frame >= F.typeStart && frame < F.filtersOpen ? (
                <TypingText text="Toyota Hilux" startFrame={F.typeStart} charsPerFrame={0.6} />
              ) : frame >= F.filtersOpen ? "Toyota Hilux" : <span style={{ color: COLOR.inkMute }}>Search used cars...</span>}
            </div>
          </div>

          {detailVisible ? (
            <div style={{ flex: 1, padding: 14, opacity: detailOp }}>
              <img src={staticFile("cars/hilux-white-2019-1.jpg")} alt="" style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: RADIUS.md, marginBottom: 10, display: "block" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Toyota Hilux D-Cab</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: COLOR.brandInk, fontFamily: "Inter, sans-serif", marginBottom: 8 }}>TZS 78,500,000</div>
              <div style={{ fontSize: 10, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif" }}>45,000 km · Automatic · Dar es Salaam</div>
            </div>
          ) : (
            <div style={{ flex: 1, padding: "12px 14px", overflow: "hidden" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Filters
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {["Make", "Price Range", "City"].map((f, i) => (
                  <div key={f} style={{
                    fontSize: 9, fontWeight: 600, fontFamily: "Inter, sans-serif", padding: "5px 9px", borderRadius: 99,
                    border: `1px solid ${i === 0 && makeChosen ? COLOR.brand : COLOR.border}`,
                    background: i === 0 && makeChosen ? COLOR.brandSoft : COLOR.bg,
                    color: i === 0 && makeChosen ? COLOR.brandInk : COLOR.inkSoft,
                  }}>
                    {i === 0 && makeChosen ? "Toyota" : f}
                  </div>
                ))}
              </div>

              {resultsVisible ? (
                <div style={{ opacity: resultsOp }}>
                  <VehicleCard title="Toyota Hilux D-Cab" price="TZS 78,500,000" location="Dar es Salaam" km="45,000 km" year="2019" photo="cars/hilux-white-2019-1.jpg" style={{ marginBottom: 8 }} />
                  <VehicleCard title="Toyota Hilux Vigo" price="TZS 42,000,000" location="Arusha" km="98,000 km" year="2019" photo="cars/hilux-gray-2019-1.jpg" />
                </div>
              ) : (
                <div style={{ fontSize: 10, color: COLOR.inkMute, fontFamily: "Inter, sans-serif", textAlign: "center", marginTop: 40 }}>
                  {frame >= F.applyTap ? "Searching…" : "Set filters to narrow results"}
                </div>
              )}
            </div>
          )}
        </div>

        <Cursor
          path={[
            { frame: F.filtersOpen - 10, x: 0, y: 250 },
            { frame: F.makeTap - 12, x: -40, y: 310 },
            { frame: F.makeTap, x: -40, y: 310 },
            { frame: F.applyTap - 10, x: -40, y: 310 },
            { frame: F.applyTap, x: 0, y: 540 },
            { frame: F.openListing - 15, x: 0, y: 370 },
            { frame: F.openListing, x: 0, y: 370 },
          ]}
          clickFrame={F.makeTap}
          hideFrame={F.openListing + 5}
        />
      </FullBleedScreen>
    </AbsoluteFill>
  );
}

export const CHAPTER2_DURATION = 190;
