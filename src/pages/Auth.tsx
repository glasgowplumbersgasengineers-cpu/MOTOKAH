import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconMail, IconLock, IconUser, IconArrowLeft, IconBrandGoogle, IconBrandApple, IconBrandFacebook, IconSparkles, IconBuildingStore } from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getAppUrl } from "@/lib/app-url";

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

  if (user) return null;

  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: getAppUrl("/auth") },
      });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
                <Button type="button" variant="outline" className="w-full gap-2 font-medium" onClick={() => handleSocialLogin("apple")} disabled={!!socialLoading}>
                  {socialLoading === "apple" ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground" /> : <IconBrandApple size={18} />}
                  Continue with Apple
                </Button>
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
