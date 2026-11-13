import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IconCamera } from "@tabler/icons-react";
import { COLOR, EASE, RADIUS, SHADOW, SCREEN_SCALE } from "../../design";
import { FullBleedScreen } from "../../components/FullBleedScreen";
import { Cursor } from "../../components/Cursor";

// Real photo variety for the gallery grid — not the same image repeated.
const GALLERY_PHOTOS = [
  "cars/hilux-white-2019-1.jpg", "cars/hilux-gray-2019-1.jpg", "cars/hilux-arb-2019-1.jpg",
  "cars/fortuner-white-2019-1.jpg", "cars/hilux-white-2019-2.jpg", "cars/hilux-gray-2019-2.jpg",
];

// Matches the real flow in SellCar.tsx: "Choose Photos (Up to 10)" opens the
// device gallery picker — demo uses safe placeholder thumbnails, never a
// real camera or a real upload.
const F = { galleryOpen: 15, pick1: 35, pick2: 45, pick3: 55, confirm: 70, removeTap: 110 };

export function Chapter4AddPhotos() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const galleryVisible = frame >= F.galleryOpen && frame < F.confirm;
  const photosConfirmed = frame >= F.confirm;
  const photoRemoved = frame >= F.removeTap + 8;

  const pickedCount = frame >= F.pick3 ? 3 : frame >= F.pick2 ? 2 : frame >= F.pick1 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <FullBleedScreen scale={SCREEN_SCALE}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: fadeIn }}>
          <div style={{ background: COLOR.bg, padding: "16px 14px 10px", borderBottom: `1px solid ${COLOR.border}`, flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>Photos & Video</div>
          </div>

          <div style={{ flex: 1, padding: 14, overflow: "hidden" }}>
            {!galleryVisible && !photosConfirmed && (
              <div style={{ border: `2px dashed ${COLOR.border}`, borderRadius: RADIUS.lg, padding: "28px 10px", textAlign: "center" }}>
                <IconCamera size={28} stroke={1.6} style={{ color: COLOR.inkMute, marginBottom: 8 }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 10 }}>
                  Upload Photos of Your Car
                </div>
                <div style={{
                  display: "inline-block", background: COLOR.brand, color: "#fff", fontSize: 10, fontWeight: 700,
                  padding: "7px 14px", borderRadius: RADIUS.sm, fontFamily: "Inter, sans-serif",
                }}>
                  Choose Photos (Up to 10)
                </div>
              </div>
            )}

            {galleryVisible && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif", marginBottom: 8 }}>
                  Select photos ({pickedCount} selected)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const selected = i < pickedCount;
                    return (
                      <div key={i} style={{
                        aspectRatio: "1", borderRadius: RADIUS.sm, overflow: "hidden",
                        position: "relative",
                        border: selected ? `2px solid ${COLOR.brand}` : "2px solid transparent",
                      }}>
                        <img src={staticFile(GALLERY_PHOTOS[i])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        {selected && (
                          <div style={{
                            position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: "50%",
                            background: COLOR.brand, color: "#fff", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center",
                          }}>✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {photosConfirmed && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif", marginBottom: 8 }}>
                  {photoRemoved ? "2/10" : "3/10"} photos
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {Array.from({ length: 3 }).map((_, i) => {
                    if (photoRemoved && i === 1) return <div key={i} />;
                    return (
                      <div key={i} style={{
                        aspectRatio: "1", borderRadius: RADIUS.sm, overflow: "hidden",
                        position: "relative",
                      }}>
                        <img src={staticFile(GALLERY_PHOTOS[i])} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{
                          position: "absolute", top: 3, right: 3, width: 15, height: 15, borderRadius: "50%",
                          background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✕</div>
                        {i === 0 && (
                          <div style={{ position: "absolute", bottom: 3, left: 3, fontSize: 7, fontWeight: 700, color: "#fff", background: COLOR.brand, padding: "1px 4px", borderRadius: 4 }}>
                            Cover
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <Cursor
          path={[
            { frame: F.galleryOpen - 10, x: 0, y: 340 },
            { frame: F.pick1 - 5, x: -50, y: 290 },
            { frame: F.pick1, x: -50, y: 290 },
            { frame: F.pick2, x: 0, y: 290 },
            { frame: F.pick3, x: 50, y: 290 },
            { frame: F.confirm - 10, x: 0, y: 420 },
            { frame: F.confirm, x: 0, y: 420 },
            { frame: F.removeTap - 10, x: 0, y: 310 },
            { frame: F.removeTap, x: 0, y: 310 },
          ]}
          clickFrame={F.removeTap}
          hideFrame={F.removeTap + 20}
        />
      </FullBleedScreen>
    </AbsoluteFill>
  );
}

export const CHAPTER4_DURATION = 150;
