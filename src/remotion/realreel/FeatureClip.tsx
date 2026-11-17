import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame, Easing } from "remotion";
import { Screen, FPS } from "./RealReel";
import { FEATURE_CLIPS, type FeatureKey } from "./features";

// One short how-to clip per feature: real app screens, finger taps and a
// voiceover. Deliberately no captions, labels or brand cards.

const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const featureFrames = (lang: "en" | "sw", feature: FeatureKey) =>
  Math.round((FEATURE_CLIPS[lang][feature].durationMs / 1000) * FPS);

export function FeatureClip({ lang = "en", feature = "find" }: { lang?: "en" | "sw"; feature?: FeatureKey }) {
  const clip = FEATURE_CLIPS[lang][feature];
  const frame = useCurrentFrame();
  const ms = (frame / FPS) * 1000;
  const beats = clip.beats;
  let bi = 0;
  for (let i = 0; i < beats.length; i++) if (ms >= beats[i].from) bi = i;
  const beat = beats[bi];
  const beatEnd = beats[bi + 1]?.from ?? clip.durationMs;
  const prev = bi > 0 ? beats[bi - 1] : null;
  const since = ms - beat.from;
  const fadeIn = prev ? interpolate(since, [0, 280], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const slide = prev ? interpolate(since, [0, 320], [60, 0], { extrapolateRight: "clamp", easing: ease }) : 0;
  const fadeOut = interpolate(ms, [clip.durationMs - 400, clip.durationMs], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {prev && fadeIn < 1 && <Screen beat={prev} msInBeat={beat.from - prev.from} beatLen={beat.from - prev.from} />}
        <AbsoluteFill style={{ opacity: fadeIn, transform: `translateX(${slide}px)` }}>
          <Screen beat={beat} msInBeat={since} beatLen={beatEnd - beat.from} />
        </AbsoluteFill>
      </AbsoluteFill>
      <Sequence from={Math.round((clip.voDelayMs / 1000) * FPS)}>
        <Audio src={clip.vo} />
      </Sequence>
    </AbsoluteFill>
  );
}
