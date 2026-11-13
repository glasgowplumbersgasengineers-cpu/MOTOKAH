import React from "react";
import { AbsoluteFill } from "remotion";

// Replaces PhoneFrame for the portrait full-screen reel: no bezel/notch/home
// indicator, the screen content (and its Cursor) fills the whole canvas
// edge-to-edge. The content and Cursor paths inside stay authored at the
// original 280x560 "phone" coordinate space unchanged — this just scales
// that whole space up uniformly via CSS transform, so nothing about the
// already-reviewed UI content or cursor tap positions needed to be redrawn.
interface FullBleedScreenProps {
  scale: number;
  innerWidth?: number;
  innerHeight?: number;
  children: React.ReactNode;
}

export function FullBleedScreen({ scale, innerWidth = 280, innerHeight = 560, children }: FullBleedScreenProps) {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: innerWidth,
          height: innerHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
