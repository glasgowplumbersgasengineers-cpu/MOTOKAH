import { useRef, useState } from "react";
import { IconPlayerPlay, IconArrowLeft } from "@/components/icons";
import Flag from "@/components/Flag";

// The How to Use Motokah walkthrough, recorded in English and Swahili.
// The viewer picks a language, then the video plays in place. Playback is
// started from the tap itself so iOS allows it with sound.
const VIDEOS = [
  { code: "en", flag: "GB", label: "Watch in English", sub: "Tutorial, 1 minute", src: "/videos/tutorial-en.mp4" },
  { code: "sw", flag: "TZ", label: "Tazama kwa Kiswahili", sub: "Mafunzo, dakika 1", src: "/videos/tutorial-sw.mp4" },
] as const;

type Code = (typeof VIDEOS)[number]["code"];

export default function TutorialVideos({ onDone, doneLabel = "Continue" }: { onDone?: () => void; doneLabel?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<Code | null>(null);

  const pick = (code: Code) => {
    const v = videoRef.current;
    if (!v) return;
    const item = VIDEOS.find((x) => x.code === code)!;
    if (!v.src.endsWith(item.src)) v.src = item.src;
    v.currentTime = 0;
    setActive(code);
    v.play().catch(() => {});
  };

  const back = () => {
    videoRef.current?.pause();
    setActive(null);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Player stays mounted so the tap that picks a language can start it. */}
      <div className={active ? "flex-1 min-h-0 flex flex-col gap-3" : "hidden"}>
        <div className="flex-1 min-h-0 flex justify-center">
          <video
            ref={videoRef}
            playsInline
            controls
            preload="none"
            className="h-full max-w-full rounded-2xl bg-black object-contain"
          />
        </div>
        <button
          type="button"
          onClick={back}
          className="self-center flex items-center gap-1.5 text-sm font-semibold text-primary px-4 py-2 rounded-full bg-primary/10 shrink-0"
        >
          <IconArrowLeft size={16} />
          {active === "sw" ? "Chagua lugha nyingine" : "Choose another language"}
        </button>
      </div>

      {!active && (
        <div className="flex-1 flex flex-col justify-center gap-3 max-w-sm w-full mx-auto">
          <h3 className="text-xl font-bold text-center">See how Motokah works</h3>
          <p className="text-sm text-muted-foreground text-center mb-2">
            A short video on finding, posting and chatting. Pick your language.
          </p>
          {VIDEOS.map((v) => (
            <button
              key={v.code}
              type="button"
              onClick={() => pick(v.code)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary bg-card active:scale-[0.98] transition"
            >
              <Flag code={v.flag} className="h-6 w-9 shrink-0 rounded-sm" />
              <span className="flex-1 text-left">
                <span className="block font-semibold">{v.label}</span>
                <span className="block text-xs text-muted-foreground">{v.sub}</span>
              </span>
              <span className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <IconPlayerPlay size={20} />
              </span>
            </button>
          ))}
          {onDone && (
            <button type="button" onClick={onDone} className="mt-2 text-sm font-medium text-muted-foreground py-2">
              {doneLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
