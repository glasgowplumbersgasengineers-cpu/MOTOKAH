import { useRef, useState } from "react";
import { IconPlayerPlay, IconArrowLeft, IconSearch, IconMessage, IconCamera, IconList, IconLanguage } from "@/components/icons";
import Flag from "@/components/Flag";
import { useLanguage } from "@/contexts/LanguageContext";

// How to use Motokah: one short video per feature, in English or Swahili.
// The viewer taps a feature and the clip plays in place. Playback is started
// from the tap itself so iOS allows it with sound.
type Lang = "en" | "sw";
const FEATURES = [
  { key: "find", Icon: IconSearch, en: "Find a car", sw: "Tafuta gari" },
  { key: "contact", Icon: IconMessage, en: "Contact a seller", sw: "Wasiliana na muuzaji" },
  { key: "sell", Icon: IconCamera, en: "Sell your car", sw: "Uza gari lako" },
  { key: "myads", Icon: IconList, en: "Manage your ads", sw: "Simamia matangazo yako" },
  { key: "language", Icon: IconLanguage, en: "Language and currency", sw: "Lugha na sarafu" },
] as const;

type Key = (typeof FEATURES)[number]["key"];

const COPY = {
  en: { title: "How to use Motokah", sub: "Pick what you want to learn. Each video is about 10 seconds.", back: "All videos" },
  sw: { title: "Jinsi ya kutumia Motokah", sub: "Chagua unachotaka kujifunza. Kila video ni kama sekunde 10.", back: "Video zote" },
};

export default function TutorialVideos({ onDone, doneLabel = "Continue" }: { onDone?: () => void; doneLabel?: string }) {
  const { lang: appLang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lang, setLang] = useState<Lang>(appLang === "sw" ? "sw" : "en");
  const [active, setActive] = useState<Key | null>(null);
  const c = COPY[lang];

  const play = (key: Key) => {
    const v = videoRef.current;
    if (!v) return;
    const src = `/videos/features/${key}-${lang}.mp4`;
    if (!v.src.endsWith(src)) v.src = src;
    v.currentTime = 0;
    setActive(key);
    v.play().catch(() => {});
  };

  const back = () => {
    videoRef.current?.pause();
    setActive(null);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Player stays mounted so the tap that picks a feature can start it. */}
      <div className={active ? "flex-1 min-h-0 flex flex-col gap-3" : "hidden"}>
        <div className="flex-1 min-h-0 flex justify-center">
          <video
            ref={videoRef}
            playsInline
            controls
            preload="none"
            onEnded={back}
            className="h-full max-w-full rounded-2xl bg-black object-contain"
          />
        </div>
        <button
          type="button"
          onClick={back}
          className="self-center flex items-center gap-1.5 text-sm font-semibold text-primary px-4 py-2 rounded-full bg-primary/10 shrink-0"
        >
          <IconArrowLeft size={16} />
          {c.back}
        </button>
      </div>

      {!active && (
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5 max-w-sm w-full mx-auto pb-2">
          <div className="flex justify-center gap-2 mb-1">
            {(["en", "sw"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold transition-colors ${
                  lang === l ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                <Flag code={l === "en" ? "GB" : "TZ"} className="h-3.5 w-5 rounded-[2px]" />
                {l === "en" ? "English" : "Kiswahili"}
              </button>
            ))}
          </div>
          <h3 className="text-xl font-bold text-center">{c.title}</h3>
          <p className="text-sm text-muted-foreground text-center mb-1">{c.sub}</p>
          {FEATURES.map(({ key, Icon, ...label }) => (
            <button
              key={key}
              type="button"
              onClick={() => play(key)}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-border hover:border-primary bg-card active:scale-[0.98] transition"
            >
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon size={20} />
              </span>
              <span className="flex-1 text-left font-semibold">{label[lang]}</span>
              <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <IconPlayerPlay size={16} />
              </span>
            </button>
          ))}
          {onDone && (
            <button type="button" onClick={onDone} className="mt-1 text-sm font-medium text-muted-foreground py-2">
              {doneLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
