import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, EASE, RADIUS, SHADOW } from "../../design";
import { PhoneFrame } from "../../components/PhoneFrame";
import { Cursor } from "../../components/Cursor";
import { VehicleCard } from "../../components/VehicleCard";

// Real category labels — matches src/components/BrowseSection.tsx exactly,
// not invented placeholder categories.
const CATEGORIES = ["Saloon", "4x4 / SUV", "Double Cab", "Small Car"];

export function Chapter1Discover() {
  const frame = useCurrentFrame();

  const homeOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const tapCategoryFrame = 55;
  const categorySelected = frame >= tapCategoryFrame + 8;
  const resultsIn = interpolate(frame, [tapCategoryFrame + 10, tapCategoryFrame + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outExpo });
  const resultsY = interpolate(frame, [tapCategoryFrame + 10, tapCategoryFrame + 28], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE.outExpo });

  return (
    <AbsoluteFill style={{ background: COLOR.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PhoneFrame width={280} height={560}>
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
                  <div key={cat} style={{
                    background: isTapped ? COLOR.brandSoft : COLOR.bg,
                    border: `1px solid ${isTapped ? COLOR.brand : COLOR.border}`,
                    borderRadius: RADIUS.md,
                    padding: "12px 8px",
                    textAlign: "center",
                    transition: "none",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{["🚗", "🚙", "🛻", "🚘"][i]}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: isTapped ? COLOR.brandInk : COLOR.ink, fontFamily: "Inter, sans-serif" }}>
                      {cat}
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
                <VehicleCard title="Toyota Land Cruiser Prado" price="TZS 145,000,000" location="Dar es Salaam" km="62,000 km" year="2019" style={{ marginBottom: 8 }} />
                <VehicleCard title="Nissan X-Trail 2.0" price="KES 3,450,000" location="Nairobi" km="38,000 km" year="2021" />
              </div>
            )}
          </div>
        </div>
      </PhoneFrame>

      <Cursor
        path={[
          { frame: 20, x: 500, y: 400 },
          { frame: 45, x: 460, y: 330 },
          { frame: tapCategoryFrame, x: 460, y: 330 },
        ]}
        clickFrame={tapCategoryFrame}
        hideFrame={tapCategoryFrame + 15}
      />
    </AbsoluteFill>
  );
}

export const CHAPTER1_DURATION = 130;
