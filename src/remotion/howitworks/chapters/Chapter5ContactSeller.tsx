import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IconMessageCircle, IconSend } from "@tabler/icons-react";
import { COLOR, EASE, RADIUS, SHADOW, SCREEN_SCALE } from "../../design";
import { FullBleedScreen } from "../../components/FullBleedScreen";
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
  const messageSent = frame >= F.sendTap;
  const replyVisible = frame >= F.sellerReply;
  const replyOp = interpolate(frame, [F.sellerReply, F.sellerReply + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <FullBleedScreen scale={SCREEN_SCALE}>
        <div style={{ height: "100%", background: COLOR.surface, display: "flex", flexDirection: "column", opacity: fadeIn }}>
          {!inChat ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <img src={staticFile("cars/hilux-white-2019-1.jpg")} alt="" style={{ height: 120, width: "100%", objectFit: "cover", flexShrink: 0, display: "block" }} />
              <div style={{ padding: 14, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink, fontFamily: "Inter, sans-serif", marginBottom: 4 }}>Toyota Hilux D-Cab 2021</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: COLOR.brandInk, fontFamily: "Inter, sans-serif", marginBottom: 14 }}>TZS 78,500,000</div>
                <div style={{
                  background: COLOR.brand, color: "#fff", borderRadius: RADIUS.md, padding: "11px", textAlign: "center",
                  fontSize: 11, fontWeight: 700, fontFamily: "Inter, sans-serif", boxShadow: SHADOW.card,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <IconMessageCircle size={14} /> Message on Motokah
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
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLOR.brand, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <IconSend size={13} />
                </div>
              </div>
            </>
          )}
        </div>

        <Cursor taps={[{ frame: F.tapMessage, x: 140, y: 215 }, { frame: F.sendTap, x: 256, y: 534 }]} />
      </FullBleedScreen>
    </AbsoluteFill>
  );
}

export const CHAPTER5_DURATION = 150;
