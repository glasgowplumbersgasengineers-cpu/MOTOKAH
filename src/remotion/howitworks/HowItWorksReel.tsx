import { AbsoluteFill, Sequence } from "remotion";
import { Chapter1Discover, CHAPTER1_DURATION } from "./chapters/Chapter1Discover";
import { Chapter2Search, CHAPTER2_DURATION } from "./chapters/Chapter2Search";
import { Chapter3PostAd, CHAPTER3_DURATION } from "./chapters/Chapter3PostAd";
import { Chapter4AddPhotos, CHAPTER4_DURATION } from "./chapters/Chapter4AddPhotos";
import { Chapter5ContactSeller, CHAPTER5_DURATION } from "./chapters/Chapter5ContactSeller";
import { Chapter6ReceiveOffers, CHAPTER6_DURATION } from "./chapters/Chapter6ReceiveOffers";
import { Chapter7ManageListings, CHAPTER7_DURATION } from "./chapters/Chapter7ManageListings";
import { Chapter8LanguageCurrency, CHAPTER8_DURATION } from "./chapters/Chapter8LanguageCurrency";

// Built from scratch for /how-it-works — does not reuse or modify /promo's
// composition or route. All 8 requested chapters, in order.
export interface ChapterMark {
  key: string;
  startFrame: number;
  durationInFrames: number;
}

const DURATIONS = [
  CHAPTER1_DURATION, CHAPTER2_DURATION, CHAPTER3_DURATION, CHAPTER4_DURATION,
  CHAPTER5_DURATION, CHAPTER6_DURATION, CHAPTER7_DURATION, CHAPTER8_DURATION,
];
const KEYS = ["discover", "search", "postAd", "addPhotos", "contactSeller", "receiveOffers", "manageListings", "languageCurrency"];

export const CHAPTERS: ChapterMark[] = KEYS.map((key, i) => ({
  key,
  startFrame: DURATIONS.slice(0, i).reduce((a, b) => a + b, 0),
  durationInFrames: DURATIONS[i],
}));

export const TOTAL_DURATION = CHAPTERS.reduce((sum, c) => sum + c.durationInFrames, 0);
export const FPS = 30;
export const COMPOSITION_WIDTH = 1280;
export const COMPOSITION_HEIGHT = 720;

const COMPONENTS = [
  Chapter1Discover, Chapter2Search, Chapter3PostAd, Chapter4AddPhotos,
  Chapter5ContactSeller, Chapter6ReceiveOffers, Chapter7ManageListings, Chapter8LanguageCurrency,
];

export function HowItWorksReel() {
  return (
    <AbsoluteFill>
      {CHAPTERS.map((chapter, i) => {
        const Component = COMPONENTS[i];
        return (
          <Sequence key={chapter.key} from={chapter.startFrame} durationInFrames={chapter.durationInFrames}>
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
