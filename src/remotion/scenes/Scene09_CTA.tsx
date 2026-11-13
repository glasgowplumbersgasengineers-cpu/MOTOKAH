import { useCurrentFrame, spring } from "remotion";
import { COLOR, SPRING, cursorGlow } from "../design";
import { TapDot } from "../components/Cursor";

const DOMAIN = "motokah.com";

export function Scene09_CTA() {
  const frame = useCurrentFrame();

  // Slow camera zoom in throughout scene
  const zoomStart = 0;
  const zoomProgress = Math.max(0, Math.min(1, frame / 100));
  const zoomSpring = spring({
    frame: zoomProgress * 30,
    fps: 30,
    config: SPRING.cinematic,
  });
  const cameraZoom = 1 + zoomSpring * 0.06;

  // Swahili text reveal
  const swahiliSpring = spring({
    frame: Math.max(0, frame - 5),
    fps: 30,
    config: SPRING.main,
  });

  // Translation reveal
  const transSpring = spring({
    frame: Math.max(0, frame - 20),
    fps: 30,
    config: SPRING.cinematic,
  });

  // Domain: character-by-character spring reveal
  const domainChars = DOMAIN.split("").map((char, i) => {
    const delay = 35 + i * 2;
    const t = Math.max(0, Math.min(1, (frame - delay) / 10));
    const s = spring({ frame: t * 30, fps: 30, config: SPRING.snap });

    return {
      char,
      opacity: s,
      transform: `translate3d(0, ${(1 - s) * 20}px, 0) scale(${0.8 + s * 0.2})`,
    };
  });

  // CTA button spring
  const btnStart = 55;
  const btnSpring = spring({
    frame: Math.max(0, frame - btnStart),
    fps: 30,
    config: SPRING.elastic,
  });

  // Button pulse after appear
  const btnPulse = frame >= btnStart + 20
    ? 1 + 0.04 * Math.sin(frame * 0.12)
    : 1;

  const btnGlow = frame >= btnStart + 20
    ? 0.2 + 0.15 * Math.sin(frame * 0.12)
    : 0;

  // Cursor path: glides to button
  const cursorStart = 75;
  const cursorT = Math.max(0, Math.min(1, (frame - cursorStart) / 25));
  const cursorSpring = spring({
    frame: cursorT * 30,
    fps: 30,
    config: SPRING.cinematic,
  });

  const cursorX = 540 + cursorSpring * 100; // Glides to button center
  const cursorY = 420 + cursorSpring * 20;

  // Click effect
  const clickFrame = cursorStart + 25;
  const clickEffect = cursorGlow(frame, clickFrame);

  // Watermark
  const wmSpring = spring({
    frame: Math.max(0, frame - 2),
    fps: 30,
    config: SPRING.main,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${cameraZoom})`,
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 48,
          fontSize: 14,
          fontWeight: 700,
          color: COLOR.inkMute,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "-0.01em",
          opacity: wmSpring,
        }}
      >
        Motokah
      </div>

      {/* Swahili */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          fontFamily: "Inter, system-ui, sans-serif",
          color: COLOR.ink,
          letterSpacing: "-0.03em",
          marginBottom: 12,
          opacity: swahiliSpring,
          transform: `translate3d(0, ${(1 - swahiliSpring) * 25}px, 0)`,
        }}
      >
        Gari yako, bei yako.
      </div>

      {/* Translation */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          fontFamily: "Inter, sans-serif",
          color: COLOR.inkSoft,
          marginBottom: 56,
          opacity: transSpring,
          transform: `translate3d(0, ${(1 - transSpring) * 15}px, 0)`,
        }}
      >
        Your car, your price.
      </div>

      {/* Domain */}
      <div
        style={{
          display: "flex",
          fontSize: 88,
          fontWeight: 800,
          fontFamily: "Inter, system-ui, sans-serif",
          color: COLOR.brand,
          letterSpacing: "-0.04em",
          marginBottom: 64,
          lineHeight: 1,
          textShadow: `0 0 60px ${COLOR.brandGlow}`,
        }}
      >
        {domainChars.map((c, i) => (
          <span
            key={i}
            style={{
              opacity: c.opacity,
              transform: c.transform,
              display: "inline-block",
            }}
          >
            {c.char}
          </span>
        ))}
      </div>

      {/* CTA button with glow */}
      <div
        style={{
          opacity: btnSpring,
          transform: `translate3d(0, ${(1 - btnSpring) * 20}px, 0)`,
          position: "relative",
        }}
      >
        {/* Glow behind button */}
        <div
          style={{
            position: "absolute",
            inset: "-12px -24px",
            background: `radial-gradient(ellipse at center, rgba(0,102,204,${btnGlow}) 0%, transparent 70%)`,
            borderRadius: 20,
            pointerEvents: "none",
          }}
        />

        {/* Button */}
        <div
          style={{
            background: COLOR.brand,
            color: "#fff",
            fontSize: 20,
            fontWeight: 800,
            fontFamily: "Inter, sans-serif",
            padding: "20px 48px",
            borderRadius: 16,
            letterSpacing: "-0.01em",
            transform: `scale(${btnPulse})`,
            position: "relative",
            boxShadow: `0 0 40px ${COLOR.brandGlow}, 0 4px 20px rgba(0,0,0,0.1)`,
            cursor: "pointer",
          }}
        >
          List your car — Free
          <span style={{ marginLeft: 8 }}>→</span>
        </div>

        {/* Click ring effect */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: `2px solid ${COLOR.brand}`,
            transform: `translate(-50%, -50%) scale(${clickEffect.scale})`,
            opacity: clickEffect.opacity,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Tap */}
      {frame >= clickFrame - 6 && frame <= clickFrame + 18 && (
        <TapDot x={cursorX} y={cursorY} tf={frame - clickFrame} size={52} />
      )}
    </div>
  );
}
