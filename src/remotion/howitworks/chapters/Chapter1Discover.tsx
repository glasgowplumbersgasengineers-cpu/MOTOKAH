import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLOR, EASE, RADIUS, SHADOW, SCREEN_SCALE } from "../../design";
import { FullBleedScreen } from "../../components/FullBleedScreen";
import { Cursor } from "../../components/Cursor";
import { VehicleCard } from "../../components/VehicleCard";

// Real category labels + real icon files — matches
// src/components/BrowseSection.tsx's CATEGORIES array exactly, down to the
// exact icon filenames (not invented placeholder categories or emoji).
const CATEGORIES = [
  { name: "Saloon", icon: "icons/sedan.png" },
  { name: "4x4 / SUV", icon: "icons/suv.png" },
  { name: "Double Cab", icon: "icons/pickup.png" },
  { name: "Small Car", icon: "icons/hatchback.png" },
];

export function Chapter1Discover() {
  const frame = useCurrentFrame();

  const homeOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const tapCategoryFrame = 55;
  const categorySelected = frame >= tapCategoryFrame + 8;
  const resultsIn = interpolate(frame, [tapCategoryFrame + 10, tapCategoryFrame + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outExpo });
  const resultsY = interpolate(frame, [tapCategoryFrame + 10, tapCategoryFrame + 28], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outExpo });

  return (
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <FullBleedScreen scale={SCREEN_SCALE}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: homeOpacity }}>
          <div style={{
            background: COLOR.bg, padding: "16px 14px 10px", borderBottom: `1px solid ${COLOR.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.brand, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>
              Motokah
            </div>
          </div>

          <div style={{ padding: "14px 14px 0", flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Browse by Category
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {CATEGORIES.map((cat, i) => {
                const isTapped = i === 1 && categorySelected;
                return (
                  <div key={cat.name} style={{
                    background: isTapped ? COLOR.brandSoft : COLOR.bg,
                    border: `1px solid ${isTapped ? COLOR.brand : COLOR.border}`,
                    borderRadius: RADIUS.md,
                    padding: "12px 8px",
                    textAlign: "center",
                    transition: "none",
                  }}>
                    <img src={staticFile(cat.icon)} alt="" style={{ width: 24, height: 24, marginBottom: 4, objectFit: "contain" }} />
                    <div style={{ fontSize: 10, fontWeight: 600, color: isTapped ? COLOR.brandInk : COLOR.ink, fontFamily: "Inter, sans-serif" }}>
                      {cat.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {categorySelected && (
              <div style={{ opacity: resultsIn, transform: `translateY(${resultsY}px)` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  4x4 / SUV — 128 results
                </div>
                <VehicleCard title="Toyota Fortuner" price="TZS 145,000,000" location="Dar es Salaam" km="62,000 km" year="2019" photo="cars/fortuner-white-2019-1.jpg" style={{ marginBottom: 8 }} />
                <VehicleCard title="Land Rover Discovery" price="KES 3,450,000" location="Nairobi" km="38,000 km" year="2020" photo="cars/landrover-disco-2020-1.jpg" />
              </div>
            )}
          </div>
        </div>

        <Cursor
          path={[
            { frame: 20, x: 0, y: 320 },
            { frame: 45, x: -40, y: 250 },
            { frame: tapCategoryFrame, x: -40, y: 250 },
          ]}
          clickFrame={tapCategoryFrame}
          hideFrame={tapCategoryFrame + 15}
        />
      </FullBleedScreen>
    </AbsoluteFill>
  );
}

export const CHAPTER1_DURATION = 130;
