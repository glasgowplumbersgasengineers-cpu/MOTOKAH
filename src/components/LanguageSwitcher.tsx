import { IconCheck, IconChevronDown, IconLanguage } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, type LangCode, useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const select = (code: LangCode) => {
    setLang(code);
    setOpen(false);
  };

  if (mobile) {
    return (
      <div className="px-2 py-1">
        <p className="mb-2 text-[11px] font-bold uppercase text-muted-foreground">Language</p>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGES.map((item) => (
            <button key={item.code} onClick={() => select(item.code)}
              className={`flex min-h-10 items-center justify-between rounded-lg border px-3 text-sm ${lang === item.code ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>
              <span>{item.flag} {item.name}</span>
              {lang === item.code && <IconCheck size={14} />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((value) => !value)}
        className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        title="Change language">
        <IconLanguage size={15} />
        <span>{active.flag} {active.code.toUpperCase()}</span>
        <IconChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-xl">
          {LANGUAGES.map((item) => (
            <button key={item.code} onClick={() => select(item.code)}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-muted ${lang === item.code ? "font-semibold text-primary" : "text-foreground"}`}>
              <span>{item.flag} {item.name}</span>
              {lang === item.code && <IconCheck size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
