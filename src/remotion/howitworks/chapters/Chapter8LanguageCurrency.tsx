import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLOR, EASE, RADIUS, SHADOW, SCREEN_SCALE } from "../../design";
import { FullBleedScreen } from "../../components/FullBleedScreen";
import { Cursor } from "../../components/Cursor";

// Real supported options — matches LanguageContext.tsx (en/sw) and the
// currencies used across SellCar.tsx / usePriceFormatter (TZS, KES, etc.).
const F = { langTap: 15, langOpen: 25, swTap: 50, labelsSwitch: 60, currTap: 95, currOpen: 105, kesTap: 130, priceUpdate: 140 };

export function Chapter8LanguageCurrency() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const isSwahili = frame >= F.labelsSwitch;
  const langDropdownOpen = frame >= F.langOpen && frame < F.labelsSwitch;
  const currDropdownOpen = frame >= F.currOpen && frame < F.priceUpdate;
  const isKES = frame >= F.priceUpdate;

  return (
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <FullBleedScreen scale={SCREEN_SCALE}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: fadeIn, position: "relative" }}>
          <div style={{ background: COLOR.bg, padding: "16px 14px 10px", borderBottom: `1px solid ${COLOR.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.brand, fontFamily: "Inter, sans-serif" }}>Motokah</div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "Inter, sans-serif", border: `1px solid ${COLOR.border}`, borderRadius: RADIUS.sm, padding: "4px 7px", color: COLOR.ink }}>
                {isSwahili ? "🇹🇿 SW" : "🇬🇧 EN"}
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "Inter, sans-serif", border: `1px solid ${COLOR.border}`, borderRadius: RADIUS.sm, padding: "4px 7px", color: COLOR.ink }}>
                {isKES ? "KES" : "TZS"}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>
              {isSwahili ? "Tafuta gari lako linalofuata" : "Find your next car"}
            </div>
            <div style={{ fontSize: 10, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif", marginBottom: 14 }}>
              {isSwahili ? "Kote Afrika Mashariki" : "Across East Africa"}
            </div>
            <div style={{ background: COLOR.bg, border: `1px solid ${COLOR.border}`, borderRadius: RADIUS.lg, padding: 12 }}>
              <img src={staticFile("cars/fortuner-white-2019-2.jpg")} alt="" style={{ height: 60, width: "100%", objectFit: "cover", borderRadius: RADIUS.sm, marginBottom: 8, display: "block" }} />
              <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>Toyota Land Cruiser</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: COLOR.brandInk, fontFamily: "Inter, sans-serif" }}>
                {isKES ? "KES 5,160,000" : "TZS 145,000,000"}
              </div>
            </div>
          </div>

          {langDropdownOpen && (
            <div style={{ position: "absolute", top: 46, right: 56, width: 110, background: COLOR.surface, borderRadius: RADIUS.md, boxShadow: SHADOW.lift, border: `1px solid ${COLOR.border}`, overflow: "hidden", zIndex: 5 }}>
              <div style={{ padding: "8px 10px", fontSize: 10, fontFamily: "Inter, sans-serif", color: COLOR.ink, borderBottom: `1px solid ${COLOR.border}` }}>🇬🇧 English</div>
              <div style={{ padding: "8px 10px", fontSize: 10, fontFamily: "Inter, sans-serif", color: frame >= F.swTap ? COLOR.brandInk : COLOR.ink, background: frame >= F.swTap ? COLOR.brandSoft : "transparent", fontWeight: frame >= F.swTap ? 700 : 400 }}>🇹🇿 Kiswahili</div>
            </div>
          )}

          {currDropdownOpen && (
            <div style={{ position: "absolute", top: 46, right: 10, width: 90, background: COLOR.surface, borderRadius: RADIUS.md, boxShadow: SHADOW.lift, border: `1px solid ${COLOR.border}`, overflow: "hidden", zIndex: 5 }}>
              {["TZS", "KES", "UGX", "USD"].map((c) => (
                <div key={c} style={{
                  padding: "7px 10px", fontSize: 10, fontFamily: "Inter, sans-serif",
                  color: c === "KES" && frame >= F.kesTap ? COLOR.brandInk : COLOR.ink,
                  background: c === "KES" && frame >= F.kesTap ? COLOR.brandSoft : "transparent",
                  fontWeight: c === "KES" && frame >= F.kesTap ? 700 : 400,
                }}>
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        <Cursor taps={[{ frame: F.langTap, x: 208, y: 27 }, { frame: F.swTap, x: 169, y: 94 }, { frame: F.currTap, x: 250, y: 27 }, { frame: F.kesTap, x: 225, y: 90 }]} />
      </FullBleedScreen>
    </AbsoluteFill>
  );
}

export const CHAPTER8_DURATION = 170;
