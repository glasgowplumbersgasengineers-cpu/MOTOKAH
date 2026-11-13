import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { IconBell } from "@tabler/icons-react";
import { COLOR, EASE, RADIUS, SHADOW, SCREEN_SCALE } from "../../design";
import { FullBleedScreen } from "../../components/FullBleedScreen";
import { Cursor } from "../../components/Cursor";

// Honest limitation, per instruction: Motokah does not have a separate
// "offers" feature — buyer interest arrives as a direct message, and the
// seller is notified via the real NotificationBell. This demonstrates that
// actual supported flow rather than inventing an offer-management screen.
const F = { notifArrives: 15, bellTap: 45, dropdownOpen: 55, notifTap: 85, chatOpens: 100, replyTap: 135 };

export function Chapter6ReceiveOffers() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const badgeVisible = frame >= F.notifArrives;
  const dropdownVisible = frame >= F.dropdownOpen && frame < F.chatOpens;
  const inChat = frame >= F.chatOpens;
  const replied = frame >= F.replyTap;

  return (
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <FullBleedScreen scale={SCREEN_SCALE}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: fadeIn }}>
          <div style={{ background: COLOR.bg, padding: "16px 14px 10px", borderBottom: `1px solid ${COLOR.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.brand, fontFamily: "Inter, sans-serif" }}>Motokah</div>
            <div style={{ position: "relative", width: 28, height: 28, borderRadius: "50%", background: COLOR.bg, border: `1px solid ${COLOR.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBell size={14} stroke={2} style={{ color: COLOR.inkSoft }} />
              {badgeVisible && !inChat && (
                <div style={{ position: "absolute", top: -3, right: -3, width: 14, height: 14, borderRadius: "50%", background: "#D9534F", color: "#fff", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  1
                </div>
              )}
            </div>
          </div>

          {inChat ? (
            <>
              <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, flex: 1, justifyContent: "flex-end" }}>
                <div style={{ alignSelf: "flex-start", maxWidth: "75%", background: COLOR.bg, color: COLOR.ink, borderRadius: RADIUS.md, padding: "8px 11px", fontSize: 10, fontFamily: "Inter, sans-serif" }}>
                  Is this still available?
                </div>
                {replied && (
                  <div style={{ alignSelf: "flex-end", maxWidth: "75%", background: COLOR.brand, color: "#fff", borderRadius: RADIUS.md, padding: "8px 11px", fontSize: 10, fontFamily: "Inter, sans-serif" }}>
                    Yes! Still available.
                  </div>
                )}
              </div>
              <div style={{ borderTop: `1px solid ${COLOR.border}`, padding: 10, display: "flex", gap: 6 }}>
                <div style={{ flex: 1, background: COLOR.bg, border: `1px solid ${replied ? COLOR.border : COLOR.brand}`, borderRadius: RADIUS.md, padding: "8px 10px", fontSize: 10, color: COLOR.inkMute, fontFamily: "Inter, sans-serif" }}>
                  {replied ? "Type a message..." : "Yes! Still available."}
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, padding: 14, position: "relative" }}>
              <div style={{ fontSize: 10, color: COLOR.inkMute, fontFamily: "Inter, sans-serif", textAlign: "center", marginTop: 60 }}>
                {badgeVisible ? "New notification received" : "No new notifications"}
              </div>

              {dropdownVisible && (
                <div style={{
                  position: "absolute", top: 0, right: 8, width: "88%", background: COLOR.surface,
                  borderRadius: RADIUS.lg, boxShadow: SHADOW.lift, border: `1px solid ${COLOR.border}`, overflow: "hidden",
                }}>
                  <div style={{ padding: "10px 12px", borderBottom: `1px solid ${COLOR.border}`, fontSize: 11, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>
                    Notifications
                  </div>
                  <div style={{ padding: "10px 12px", background: COLOR.brandSoft }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>New message</div>
                    <div style={{ fontSize: 9, color: COLOR.inkSoft, fontFamily: "Inter, sans-serif" }}>You have a new message from a buyer.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Cursor
          path={[
            { frame: F.bellTap - 10, x: 25, y: 220 },
            { frame: F.bellTap, x: 25, y: 220 },
            { frame: F.notifTap - 10, x: 0, y: 300 },
            { frame: F.notifTap, x: 0, y: 300 },
            { frame: F.replyTap - 10, x: 0, y: 520 },
            { frame: F.replyTap, x: 0, y: 520 },
          ]}
          clickFrame={F.bellTap}
          hideFrame={F.replyTap + 10}
        />
      </FullBleedScreen>
    </AbsoluteFill>
  );
}

export const CHAPTER6_DURATION = 160;
