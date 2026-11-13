import { Easing, spring } from "remotion";

// BRAND COLORS — white/blue, matching the Motokah website
export const COLOR = {
  bg:        "#F8FAFB",       // website background
  surface:   "#FFFFFF",       // cards, phone screens
  brand:     "#0066CC",       // primary blue
  brandSoft: "#EBF3FF",       // light blue bg for chips/badges
  brandInk:  "#004B99",       // darker blue for text
  brandGlow: "rgba(0,102,204,0.22)",
  accent:    "#F5A623",       // gold (kept for highlights only)
  accentGlow:"rgba(245,166,35,0.25)",
  ink:       "#1A3A52",       // dark text
  inkSoft:   "#4A6580",       // medium text
  inkMute:   "#8BA3B8",       // placeholder text
  border:    "#D1D9E0",       // borders
  ok:        "#2BAF6B",       // success / WhatsApp green
};

export const SHADOW = {
  card:  "0 4px 24px rgba(0,0,0,0.08)",
  lift:  "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,102,204,0.06)",
  brand: "0 0 60px rgba(0,102,204,0.15), 0 4px 20px rgba(0,102,204,0.1)",
  glow:  "0 0 80px rgba(0,102,204,0.1)",
};

export const RADIUS = { sm: 8, md: 12, lg: 20, xl: 28, phone: 44 };

// CINEMATIC EASING
export const EASE = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  inOutCubic: Easing.bezier(0.65, 0, 0.35, 1),
  outQuart: Easing.bezier(0.25, 1, 0.5, 1),
  springy: Easing.bezier(0.34, 1.56, 0.64, 1),
};

// SPRING CONFIGS - no linear interpolation anywhere
export const SPRING = {
  main: { stiffness: 120, damping: 15, mass: 1 },
  snap: { stiffness: 200, damping: 20, mass: 0.8 },
  cinematic: { stiffness: 60, damping: 12, mass: 1.5 },
  float: { stiffness: 80, damping: 8, mass: 2 },
  punch: { stiffness: 300, damping: 18, mass: 0.6 },
  elastic: { stiffness: 150, damping: 10, mass: 1.2 },
};

// HELPER: Spring-based opacity + transform (Apple-style blur-to-sharp reveal)
export function appleReveal(
  frame: number,
  startFrame: number,
  duration: number = 20,
  direction: "up" | "down" | "left" | "right" = "up"
) {
  const t = Math.max(0, Math.min(1, (frame - startFrame) / duration));
  const s = spring({ frame: t * 30, fps: 30, config: SPRING.main });

  const distance = 30;
  const yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;
  const xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;

  return {
    opacity: s,
    transform: `translate3d(${xOffset * (1 - s)}px, ${yOffset * (1 - s)}px, 0)`,
  };
}

// HELPER: Camera zoom effect (scale 1.08 → 1.0)
export function cameraZoom(frame: number, startFrame: number, duration: number = 60) {
  const t = Math.max(0, Math.min(1, (frame - startFrame) / duration));
  const s = spring({ frame: t * 30, fps: 30, config: SPRING.cinematic });
  return 1.08 - (0.08 * s);
}

// HELPER: Camera punch in (scale 1.0 → 1.15 → 1.0)
export function cameraPunch(frame: number, punchFrame: number) {
  const t = Math.max(0, frame - punchFrame);
  const s = spring({ frame: t, fps: 30, config: SPRING.punch });
  return 1 + (0.15 * s * Math.max(0, 1 - t / 20));
}

// HELPER: Staggered word reveal
export function wordReveal(frame: number, words: string[], startFrame: number, stagger: number = 3) {
  return words.map((_, i) => {
    const t = Math.max(0, Math.min(1, (frame - (startFrame + i * stagger)) / 12));
    const s = spring({ frame: t * 30, fps: 30, config: SPRING.snap });
    return {
      word: words[i],
      opacity: s,
      transform: `translate3d(0, ${(1 - s) * 20}px, 0)`,
    };
  });
}

// HELPER: Cursor glow click effect
export function cursorGlow(frame: number, clickFrame: number) {
  const t = Math.max(0, frame - clickFrame);
  const s = spring({ frame: t, fps: 30, config: SPRING.snap });
  return {
    scale: 1 + (0.5 * s * Math.max(0, 1 - t / 15)),
    opacity: s * Math.max(0, 1 - t / 20),
  };
}

// HELPER: Motion blur for fast transitions
export function motionBlur(frame: number, velocity: number) {
  const blurAmount = Math.min(8, Math.abs(velocity) * 0.3);
  return `blur(${blurAmount}px)`;
}

// No dark overlays for white theme
export const colorGrade = {
  warmOverlay: "none",
  vignette: "none",
};

// How It Works reel: every chapter's screen content was authored at this
// "phone" coordinate space, then scaled up uniformly by FullBleedScreen to
// fill the real (portrait, full-bleed, no device-chrome) composition canvas
// — see HowItWorksReel.tsx's COMPOSITION_WIDTH/HEIGHT, which are an exact
// 1:2 multiple of these so the scale-up is distortion-free.
export const SCREEN_INNER_WIDTH = 280;
export const SCREEN_INNER_HEIGHT = 560;
export const SCREEN_SCALE = 1080 / SCREEN_INNER_WIDTH;
