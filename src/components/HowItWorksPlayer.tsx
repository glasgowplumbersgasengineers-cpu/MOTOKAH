import { useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { IconPlayerPlay, IconPlayerPause, IconRotateClockwise } from "@tabler/icons-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HowItWorksReel, CHAPTERS, TOTAL_DURATION, FPS, COMPOSITION_WIDTH, COMPOSITION_HEIGHT } from "@/remotion/howitworks/HowItWorksReel";

// Separate component so the page can React.lazy() it — Remotion + the
// composition tree are heavy and must not ship in the main homepage bundle.
export default function HowItWorksPlayer() {
  const { t } = useLanguage();
  const playerRef = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const goToChapter = (index: number) => {
    const chapter = CHAPTERS[index];
    playerRef.current?.seekTo(chapter.startFrame);
    setActiveChapter(index);
    playerRef.current?.play();
    setPlaying(true);
  };

  const togglePlay = () => {
    if (playing) { playerRef.current?.pause(); setPlaying(false); }
    else { playerRef.current?.play(); setPlaying(true); }
  };

  const replay = () => {
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
    setPlaying(true);
    setActiveChapter(0);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-5 items-start">
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="aspect-video w-full bg-muted/30">
          <Player
            ref={playerRef}
            component={HowItWorksReel}
            durationInFrames={TOTAL_DURATION}
            fps={FPS}
            compositionWidth={COMPOSITION_WIDTH}
            compositionHeight={COMPOSITION_HEIGHT}
            style={{ width: "100%", height: "100%" }}
            controls={false}
            loop={false}
            // No autoplay with sound on iOS — require an explicit tap, and
            // this reel has no audio track anyway (silent UI demo).
            autoPlay={false}
            onFrameUpdate={() => {}}
            onEnded={() => setPlaying(false)}
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-t border-border">
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0"
            aria-label={playing ? t("howItWorks.pause") : t("howItWorks.play")}
          >
            {playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
          </button>
          <button
            type="button"
            onClick={replay}
            className="w-9 h-9 rounded-full border border-border text-muted-foreground flex items-center justify-center shrink-0 hover:text-foreground hover:border-primary/40 transition-colors"
            aria-label={t("howItWorks.replay")}
          >
            <IconRotateClockwise size={16} />
          </button>
          <span className="text-xs text-muted-foreground font-medium truncate">
            {t(`howItWorks.chapter.${CHAPTERS[activeChapter].key}.title`)}
          </span>
        </div>
      </div>

      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
        <p className="hidden lg:block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {t("howItWorks.chapters")}
        </p>
        {CHAPTERS.map((chapter, i) => (
          <button
            key={chapter.key}
            type="button"
            onClick={() => goToChapter(i)}
            className={`shrink-0 lg:shrink text-left rounded-xl border px-3.5 py-2.5 transition-colors ${
              activeChapter === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <div className={`text-xs font-bold mb-0.5 ${activeChapter === i ? "text-primary" : "text-foreground"}`}>
              {i + 1}. {t(`howItWorks.chapter.${chapter.key}.title`)}
            </div>
            <p className="hidden lg:block text-[11px] text-muted-foreground leading-snug">
              {t(`howItWorks.chapter.${chapter.key}.desc`)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
