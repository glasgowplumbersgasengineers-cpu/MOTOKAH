import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, EASE, RADIUS, SHADOW } from "../../design";
import { PhoneFrame } from "../../components/PhoneFrame";
import { Cursor } from "../../components/Cursor";
import { TypingText } from "../../components/TypingText";

// Matches the real "Message on Motokah" button on ListingDetail.tsx/SellerCard.tsx
// and the real Messages.tsx chat UI (bubbles, input placeholder text).
const F = { tapMessage: 15, chatOpens: 30, keyboardUp: 45, typeStart: 55, sendTap: 90, sellerReply: 115 };
const MSG = "Is this still available?";

export function Chapter5ContactSeller() {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: EASE.outExpo });
  const inChat = frame >= F.chatOpens;
  const keyboardVisible = frame >= F.keyboardUp && frame < F.sendTap + 6;
  const messageSent = frame >= F.sendTap;
  const replyVisible = frame >= F.sellerReply;
  const replyOp = interpolate(frame, [F.sellerReply, F.sellerReply + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLOR.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PhoneFrame width={280} height={560}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: fadeIn }}>
          {!inChat ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ height: 120, background: "linear-gradient(135deg,#dce8f5,#c3d9ee)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>🚙</div>
              <div style={{ padding: 14, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Toyota Hilux D-Cab 2021</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: COLOR.brandInk, fontFamily: "Inter, sans-serif", marginBottom: 14 }}>TZS 78,500,000</div>
                <div style={{
                  background: COLOR.brand, color: "#fff", borderRadius: RADIUS.md, padding: "11px", textAlign: "center",
                  fontSize: 11, fontWeight: 700, fontFamily: "Inter, sans-serif", boxShadow: SHADOW.card,
                }}>
                  💬 Message on Motokah
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ background: COLOR.bg, padding: "14px 14px 10px", borderBottom: `1px solid ${COLOR.border}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: COLOR.brandSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: COLOR.brandInk }}>S</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>Seller</div>
              </div>

              <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end" }}>
                {messageSent && (
                  <div style={{ alignSelf: "flex-end", maxWidth: "75%", background: COLOR.brand, color: "#fff", borderRadius: RADIUS.md, padding: "8px 11px", fontSize: 10, fontFamily: "Inter, sans-serif" }}>
                    {MSG}
                  </div>
                )}
                {replyVisible && (
                  <div style={{ alignSelf: "flex-start", maxWidth: "75%", background: COLOR.bg, color: COLOR.ink, borderRadius: RADIUS.md, padding: "8px 11px", fontSize: 10, fontFamily: "Inter, sans-serif", opacity: replyOp }}>
                    Yes, still available! Want to view it?
                  </div>
                )}
              </div>

              <div style={{ borderTop: `1px solid ${COLOR.border}`, padding: 10, display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <div style={{ flex: 1, background: COLOR.bg, border: `1px solid ${COLOR.border}`, borderRadius: RADIUS.md, padding: "8px 10px", fontSize: 10, color: COLOR.ink, fontFamily: "Inter, sans-serif" }}>
                  {!messageSent && frame >= F.typeStart ? <TypingText text={MSG} startFrame={F.typeStart} charsPerFrame={0.7} /> : !messageSent ? <span style={{ color: COLOR.inkMute }}>Type a message...</span> : null}
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLOR.brand, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>➤</div>
              </div>

              {keyboardVisible && (
                <div style={{ height: 90, background: COLOR.border, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: COLOR.inkMute, fontFamily: "Inter, sans-serif" }}>
                  ⌨️ keyboard
                </div>
              )}
            </>
          )}
        </div>
      </PhoneFrame>

      <Cursor
        path={[
          { frame: F.tapMessage - 10, x: 500, y: 420 },
          { frame: F.tapMessage, x: 500, y: 420 },
          { frame: F.typeStart - 10, x: 480, y: 600 },
          { frame: F.sendTap - 5, x: 540, y: 600 },
          { frame: F.sendTap, x: 540, y: 600 },
        ]}
        clickFrame={F.tapMessage}
        hideFrame={F.sendTap + 10}
      />
    </AbsoluteFill>
  );
}

export const CHAPTER5_DURATION = 150;
