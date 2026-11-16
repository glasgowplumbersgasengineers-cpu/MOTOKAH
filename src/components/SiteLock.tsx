import { useState } from "react";
import { IconLock, IconEye, IconEyeOff } from "@/components/icons";

const PASSWORD = "MOTO2026";
const SESSION_KEY = "motokah_unlocked";

export default function SiteLock({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">M</span>
            </div>
            <span className="text-2xl font-black text-foreground tracking-tight">Motokah</span>
          </div>
          <p className="text-sm text-muted-foreground">Private preview — enter access code to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`bg-card border rounded-xl p-6 shadow-lg transition-all duration-200 ${error ? "border-destructive" : "border-border"}`}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <IconLock size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Access Required</p>
              <p className="text-xs text-muted-foreground">This site is in private beta</p>
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type={showPw ? "text" : "password"}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter access code"
              className={`w-full h-11 pl-4 pr-10 rounded-lg border bg-background text-base focus:outline-none focus:ring-2 transition-colors ${
                error
                  ? "border-destructive ring-destructive/30 placeholder-destructive/50"
                  : "border-input focus:ring-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-destructive mb-3 text-center">Incorrect access code. Please try again.</p>
          )}

          <button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Enter
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by{" "}
          <a href="https://1pointsolutions.cloud/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline underline-offset-2">
            1Point Solutions
          </a>
        </p>
      </div>
    </div>
  );
}
