import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { REELS, REELS_SHORT, type ReelChapter, type Beat, type ReelLang } from "./data";

// How It Works, built from real app screenshots (public/howitworks/shots) with
// a voiceover per chapter (public/howitworks/vo). Each chapter pans and zooms
// through its screens, shows a finger tap before every screen change, and
// captions the voiceover word by word.

export const FPS = 30;
const CSS_W = 390; // screenshots are captured at 390 CSS px wide
export const COMPOSITION_WIDTH = 1080;
export const COMPOSITION_HEIGHT = 2338; // iPhone 390x844 ratio
const S = COMPOSITION_WIDTH / CSS_W;
const VIEW_H = COMPOSITION_HEIGHT / S; // 844 CSS px
const BLUE = "#014DC5";
const TAIL_MS = 450; // breathing room after each voice line

const msToFrames = (ms: number) => Math.round((ms / 1000) * FPS);
const tailOf = (c: ReelChapter) => c.tailMs ?? TAIL_MS;
const chapterFrames = (c: ReelChapter) => msToFrames(c.durationMs + tailOf(c));
const reelFor = (lang: ReelLang, short = false) => (short ? REELS_SHORT : REELS)[lang];

export interface ChapterMark { key: string; title: string; startFrame: number; durationInFrames: number }
export type { ReelLang };
export const reelLang = (lang: string): ReelLang => (lang === "sw" ? "sw" : "en");
export function getChapters(lang: ReelLang, short = false): ChapterMark[] {
  return reelFor(lang, short).reduce<ChapterMark[]>((acc, c) => {
    const prev = acc[acc.length - 1];
    acc.push({ key: c.key, title: c.title, startFrame: prev ? prev.startFrame + prev.durationInFrames : 0, durationInFrames: chapterFrames(c) });
    return acc;
  }, []);
}
export const getTotalDuration = (lang: ReelLang, short = false) => getChapters(lang, short).reduce((s, c) => s + c.durationInFrames, 0);

const ease = Easing.bezier(0.45, 0, 0.2, 1);

// Where the screen is scrolled (CSS px) at a given ms inside a beat.
function scrollAt(b: Beat, msInBeat: number, beatLen: number) {
  const from = b.scrollFrom ?? 0;
  const to = b.scrollTo ?? from;
  if (from === to) return from;
  const t = interpolate(msInBeat, [Math.min(400, beatLen * 0.15), beatLen * 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return from + (to - from) * t;
}

export function Screen({ beat, msInBeat, beatLen }: { beat: Beat; msInBeat: number; beatLen: number }) {
  const maxScroll = Math.max(0, beat.h - VIEW_H);
  const y = Math.min(maxScroll, scrollAt(beat, msInBeat, beatLen));
  const zoom = beat.zoom
    ? interpolate(msInBeat, [0, beatLen], [1, beat.zoom.scale], { extrapolateRight: "clamp", easing: ease })
    : 1;
  const origin = beat.zoom ? `${beat.zoom.x * S}px ${(beat.zoom.y - y) * S}px` : "50% 50%";

  // Finger tap: dot slides in, presses, ripples out.
  let tap = null;
  if (beat.tap) {
    const t = msInBeat - beat.tap.at;
    if (t > -500 && t < 700) {
      const appear = interpolate(t, [-500, -250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const press = interpolate(t, [-80, 0, 120], [1, 0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const ring = interpolate(t, [0, 600], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const fade = interpolate(t, [350, 700], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const cx = beat.tap.x * S;
      const cy = (beat.tap.y - y) * S;
      tap = (
        <>
          <div style={{ position: "absolute", left: cx - 90, top: cy - 90, width: 180, height: 180, borderRadius: "50%", border: `6px solid ${BLUE}`, opacity: (1 - ring) * fade * (t > 0 ? 1 : 0), transform: `scale(${0.4 + ring})` }} />
          <div style={{ position: "absolute", left: cx - 46, top: cy - 46, width: 92, height: 92, borderRadius: "50%", background: "rgba(255,255,255,0.55)", border: "4px solid rgba(1,77,197,0.85)", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", opacity: appear * fade, transform: `scale(${press})` }} />
        </>
      );
    }
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#F5F7FA" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: origin }}>
        <Img src={beat.src} style={{ position: "absolute", left: 0, top: -y * S, width: COMPOSITION_WIDTH, height: beat.h * S }} />
        {tap}
      </div>
    </AbsoluteFill>
  );
}

function Captions({ chapter, ms }: { chapter: ReelChapter; ms: number }) {
  const words = chapter.words;
  if (!words.length) return null;
  // Show the current phrase: words grouped into lines of about 6.
  let idx = words.findIndex((w) => ms < w.end_ms);
  if (idx === -1) idx = words.length - 1;
  const groupStart = Math.floor(idx / 6) * 6;
  const group = words.slice(groupStart, groupStart + 6);
  const visible = ms >= words[0].start_ms - 100;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 150, display: "flex", justifyContent: "center", opacity: visible ? 1 : 0 }}>
      <div style={{ background: "rgb(10,20,40)", borderRadius: 36, padding: "26px 40px", fontFamily: "Inter, system-ui, sans-serif", fontSize: 54, fontWeight: 700, lineHeight: 1.25, textAlign: "center", color: "rgba(255,255,255,0.55)", boxShadow: "0 16px 40px rgba(0,0,0,0.3)" }}>
        {group.map((w, i) => (
          <span key={groupStart + i} style={{ color: ms >= w.start_ms ? "#fff" : undefined }}>{w.text} </span>
        ))}
      </div>
    </div>
  );
}

function ChapterPill({ n, title, frame }: { n: number; title: string; frame: number }) {
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18 } });
  // Hide after 2.5s so the pill never sits on top of the app UI being shown.
  const out = interpolate(frame, [fps * 2.5, fps * 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 205, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateY(${(1 - s) * -80}px)`, opacity: s * out }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: BLUE, color: "#fff", borderRadius: 999, padding: "16px 34px 16px 18px", fontFamily: "Inter, system-ui, sans-serif", fontSize: 40, fontWeight: 800, boxShadow: "0 12px 30px rgba(1,77,197,0.35)" }}>
        <span style={{ width: 56, height: 56, borderRadius: 999, background: "#fff", color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{n}</span>
        {title}
      </div>
    </div>
  );
}

function ScreensChapter({ chapter, n }: { chapter: ReelChapter; n: number }) {
  const frame = useCurrentFrame();
  const ms = (frame / FPS) * 1000;
  const total = chapter.durationMs + tailOf(chapter);
  const beats = chapter.beats;
  let bi = 0;
  for (let i = 0; i < beats.length; i++) if (ms >= beats[i].from) bi = i;
  const beat = beats[bi];
  const beatEnd = beats[bi + 1]?.from ?? total;
  const prev = bi > 0 ? beats[bi - 1] : null;
  const sinceSwitch = ms - beat.from;
  const fadeIn = prev ? interpolate(sinceSwitch, [0, 280], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const slide = prev ? interpolate(sinceSwitch, [0, 320], [60, 0], { extrapolateRight: "clamp", easing: ease }) : 0;
  return (
    <AbsoluteFill>
      {prev && fadeIn < 1 && <Screen beat={prev} msInBeat={beat.from - prev.from} beatLen={beat.from - prev.from} />}
      <AbsoluteFill style={{ opacity: fadeIn, transform: `translateX(${slide}px)` }}>
        <Screen beat={beat} msInBeat={sinceSwitch} beatLen={beatEnd - beat.from} />
      </AbsoluteFill>
      <ChapterPill n={n} title={chapter.title} frame={frame} />
      <Captions chapter={chapter} ms={ms} />
      <Audio src={chapter.vo} />
    </AbsoluteFill>
  );
}

function BrandChapter({ chapter, line }: { chapter: ReelChapter; line: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / FPS) * 1000;
  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const text = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const glow = interpolate(frame % 90, [0, 45, 90], [0.25, 0.45, 0.25]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, #1F6BEB 0%, ${BLUE} 55%, #00327F 100%)`, alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: `rgba(255,255,255,${glow * 0.25})`, filter: "blur(80px)", top: 380 }} />
      <Img src="/brand-2026/motokah-symbol-white.svg" style={{ width: 420, height: 420, transform: `scale(${pop})`, marginTop: -200 }} />
      <div style={{ color: "#fff", fontSize: 120, fontWeight: 900, letterSpacing: 6, marginTop: 40, opacity: text, transform: `translateY(${(1 - text) * 40}px)` }}>MOTOKAH</div>
      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 52, fontWeight: 600, marginTop: 24, textAlign: "center", padding: "0 80px", opacity: text, transform: `translateY(${(1 - text) * 40}px)` }}>
        {line}
      </div>
      <Captions chapter={chapter} ms={ms} />
      <Audio src={chapter.vo} />
    </AbsoluteFill>
  );
}

export function RealReel({ lang = "en", short = false }: { lang?: ReelLang; short?: boolean }) {
  const REEL = reelFor(lang, short);
  const CHAPTERS = getChapters(lang, short);
  const outroLine = lang === "sw" ? "Weka gari lako leo" : "Post your car today";
  const introLine = lang === "sw" ? "Nunua na uza magari Afrika Mashariki" : "Buy and sell vehicles across East Africa";
  let n = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {REEL.map((c, i) => {
        const mark = CHAPTERS[i];
        const isBrand = c.beats.length === 0;
        if (!isBrand) n += 1;
        return (
          <Sequence key={c.key} from={mark.startFrame} durationInFrames={mark.durationInFrames}>
            {isBrand ? <BrandChapter chapter={c} line={i === REEL.length - 1 ? outroLine : introLine} /> : <ScreensChapter chapter={c} n={n} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
