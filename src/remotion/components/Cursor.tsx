import { interpolate, useCurrentFrame } from "remotion";
import { COLOR } from "../design";

interface Tap { frame: number; x: number; y: number; }

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Phone-style touch indicator: a finger dot lands on each tap point at its frame, presses and ripples.
// x/y are in the screen's own top-left coordinates (the 280x560 design canvas inside FullBleedScreen).
export function Cursor({ taps, size = 22 }: { taps: Tap[]; size?: number }) {
  const frame = useCurrentFrame();
  return (
    <>
      {taps.map((t) => {
        const tf = frame - t.frame;
        return tf >= -6 && tf <= 18 ? <TapDot key={t.frame} x={t.x} y={t.y} tf={tf} size={size} /> : null;
      })}
    </>
  );
}

export function TapDot({ x, y, tf, size = 22 }: { x: number; y: number; tf: number; size?: number }) {
  const opacity = interpolate(tf, [-6, -2, 10, 18], [0, 1, 1, 0], clamp);
  const press = interpolate(tf, [-6, 0, 4, 10], [1.25, 0.85, 0.85, 1], clamp);
  const ring = interpolate(tf, [0, 16], [1, 2.6], clamp);
  const ringOp = interpolate(tf, [0, 2, 16], [0, 0.7, 0], clamp);
  const half = size / 2;
  const border = Math.max(1, size / 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 100 }}>
      <div style={{
        position: "absolute", left: -half, top: -half, width: size, height: size, borderRadius: "50%",
        border: `${border * 1.5}px solid ${COLOR.brand}`, transform: `scale(${ring})`, opacity: ringOp,
      }} />
      <div style={{
        position: "absolute", left: -half, top: -half, width: size, height: size, borderRadius: "50%",
        background: "rgba(255,255,255,0.55)", border: `${border}px solid rgba(0,0,0,0.25)`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.25)", transform: `scale(${press})`, opacity,
      }} />
    </div>
  );
}
