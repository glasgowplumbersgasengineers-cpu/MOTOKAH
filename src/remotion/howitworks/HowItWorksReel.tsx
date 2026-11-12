import { AbsoluteFill, Sequence } from "remotion";
import { Chapter1Discover, CHAPTER1_DURATION } from "./chapters/Chapter1Discover";
import { Chapter3PostAd, CHAPTER3_DURATION } from "./chapters/Chapter3PostAd";

// Built from scratch for /how-it-works — does not reuse or modify /promo's
// composition or route. Two chapters implemented so far (see docs/qa for the
// honest status of the rest); this file is the single place new chapters get
// added as Sequences, with CHAPTERS kept in sync for the page's nav/seek UI.
export interface ChapterMark {
  key: string;
  startFrame: number;
  durationInFrames: number;
}

export const CHAPTERS: ChapterMark[] = [
  { key: "discover", startFrame: 0, durationInFrames: CHAPTER1_DURATION },
  { key: "postAd", startFrame: CHAPTER1_DURATION, durationInFrames: CHAPTER3_DURATION },
];

export const TOTAL_DURATION = CHAPTERS.reduce((sum, c) => sum + c.durationInFrames, 0);
export const FPS = 30;
export const COMPOSITION_WIDTH = 1280;
export const COMPOSITION_HEIGHT = 720;

export function HowItWorksReel() {
  return (
    <AbsoluteFill>
      <Sequence from={CHAPTERS[0].startFrame} durationInFrames={CHAPTERS[0].durationInFrames}>
        <Chapter1Discover />
      </Sequence>
      <Sequence from={CHAPTERS[1].startFrame} durationInFrames={CHAPTERS[1].durationInFrames}>
        <Chapter3PostAd />
      </Sequence>
    </AbsoluteFill>
  );
}
