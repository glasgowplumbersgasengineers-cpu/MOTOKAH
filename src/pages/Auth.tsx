import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconMail, IconLock, IconUser, IconArrowLeft, IconBrandGoogle, IconBrandFacebook, IconSparkles, IconBuildingStore } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getAppUrl } from "@/lib/app-url";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

type Tab = "login" | "register" | "forgot" | "otp";

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "bg-destructive", "bg-destructive", "bg-accent", "bg-success", "bg-success"];
  if (!password) return null;
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? colors[strength] : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[strength]}</p>
    </div>
  );
}


export default function Auth() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isDealer, setIsDealer] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const { signIn, signUp, resetPassword, user, isAdmin, isDealer: userIsDealer } = useAuth();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { toast } = useToast();
  const returnTo = (routeLocation.state as { from?: string } | null)?.from;
  usePageTitle(tab === "login" ? "Sign In" : tab === "register" ? "Create Account" : tab === "otp" ? "Magic Link" : "Reset Password");

  // Redirect already-logged-in users based on role (in effect to avoid render-phase navigation)
  useEffect(() => {
    if (user) {
      if (returnTo) navigate(returnTo, { replace: true });
      else if (isAdmin) navigate("/admin", { replace: true });
      else if (userIsDealer) navigate("/dealer-dashboard", { replace: true });
      else navigate(returnTo || "/profile", { replace: true });
    }
  }, [user, isAdmin, userIsDealer, navigate, returnTo]);

  useEffect(() => {
    const params = new URLSearchParams(routeLocation.search);
    if (params.get("verified") === "1") {
      toast({
        title: "Email Verified! 🎉",
        description: "Your email has been confirmed. You can now sign in.",
      });
    }
  }, [routeLocation.search, toast]);

  if (user) return null;

  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    setSocialLoading(provider);
    try {
      const isNative = Capacitor.isNativePlatform();
      const redirectTo = isNative
        ? "com.motokah.app://login-callback"
        : getAppUrl("/auth");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: isNative,
        },
      });

      if (error) throw error;

      if (isNative && data?.url) {
        await Browser.open({ url: data.url, windowName: "_self" });
        // Session is picked up by appUrlOpen handler in App.tsx
        setSocialLoading(null);
        return;
      }
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: otpEmail, options: { emailRedirectTo: getAppUrl("/auth") } });
      if (error) throw error;
      toast({ title: "Magic link sent!", description: "Check your email for the login link." });
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Welcome back!" });
      } else if (tab === "register") {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        toast({ title: "Account created!", description: "Check your email to verify your account." });
        if (isDealer) {
          setTimeout(() => navigate("/become-dealer"), 500);
        } else if (returnTo) {
          setTimeout(() => navigate(returnTo, { replace: true }), 500);
        }
      } else if (tab === "forgot") {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast({ title: "Reset email sent", description: "Check your inbox." });
      }
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="w-full max-w-md mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary">Motokah</h1>
          <p className="text-muted-foreground text-sm mt-1">Find Your Perfect Ride</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          {tab === "forgot" ? (
            <>
              <button onClick={() => setTab("login")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
                <IconArrowLeft size={16} /> Back to login
              </button>
              <h2 className="text-xl font-bold text-foreground mb-4">Reset Password</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" aria-label="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : tab === "otp" ? (
            <>
              <button onClick={() => setTab("login")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
                <IconArrowLeft size={16} /> Back to login
              </button>
              <h2 className="text-xl font-bold text-foreground mb-2">Magic Link Login</h2>
              <p className="text-sm text-muted-foreground mb-4">We'll send a login link to your email — no password needed.</p>
              <form onSubmit={handleOtp} className="space-y-4">
                <div className="relative">
                  <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" aria-label="Email" placeholder="Email" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} className="pl-10" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Magic Link"}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Social Login Buttons */}
              <div className="space-y-2 mb-5">
                <Button type="button" variant="outline" className="w-full gap-2 font-medium" onClick={() => handleSocialLogin("google")} disabled={!!socialLoading}>
                  {socialLoading === "google" ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground" /> : <IconBrandGoogle size={18} />}
                  Continue with Google
                </Button>
                {/* Apple Sign In — official Apple button design per HIG */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={!!socialLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: "#000000", color: "#FFFFFF", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", minHeight: 44 }}
                >
                  {socialLoading === "apple" ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 814 1000" aria-hidden="true">
                      <path fill="white" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-37.3-155.5-127.4C46.3 656.1 0 560.1 0 479.8c0-223.5 146.4-342.1 290.4-342.1 74.5 0 136.6 49 185 49s110.6-52 197.2-52c30.9 0 173.6 2.6 264.5 126.1zm-174.2-236.5c37.1-44.5 63.6-107.2 63.6-169.9 0-8.9-.6-17.8-2.6-24.7-58.8 2.3-129.4 38.7-170.7 84.9-32.8 36.8-62.6 97.3-62.6 160.6 0 9.5 1.9 19.1 2.6 22.1 3.9.6 10.4 1.3 16.8 1.3 52.4 0 118.6-35.4 152.9-74.3z"/>
                    </svg>
                  )}
                  Sign in with Apple
                </button>
                <Button type="button" variant="outline" className="w-full gap-2 font-medium" onClick={() => handleSocialLogin("facebook")} disabled={!!socialLoading}>
                  {socialLoading === "facebook" ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground" /> : <IconBrandFacebook size={18} className="text-[#1877F2]" />}
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-card text-muted-foreground">or continue with email</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex mb-5 border-b border-border">
                <button onClick={() => setTab("login")} className={`flex-1 pb-3 text-sm font-semibold transition-colors ${tab === "login" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
                  Sign In
                </button>
                <button onClick={() => setTab("register")} className={`flex-1 pb-3 text-sm font-semibold transition-colors ${tab === "register" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === "register" && (
                  <div className="relative">
                    <IconUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input aria-label="Full Name" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                  </div>
                )}
                <div className="relative">
                  <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="email" aria-label="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
                <div className="relative">
                  <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" aria-label="Password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                </div>
                {tab === "register" && <PasswordStrength password={password} />}

                {/* Dealer toggle — only on register */}
                {tab === "register" && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/30">
                    <input
                      type="checkbox"
                      checked={isDealer}
                      onChange={e => setIsDealer(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <div className="flex items-center gap-2">
                      <IconBuildingStore size={16} className="text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Register as a Dealer</p>
                        <p className="text-xs text-muted-foreground">You'll complete your dealer application after signup</p>
                      </div>
                    </div>
                  </label>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              {tab === "login" && (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <button onClick={() => setTab("forgot")} className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                  <button onClick={() => setTab("otp")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                    <IconSparkles size={14} /> Sign in with Magic Link
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <button onClick={() => navigate("/")} className="block w-full text-center text-sm text-muted-foreground mt-6 hover:text-foreground">
          ← Back to home
        </button>
      </div>
    </div>
  );
}
