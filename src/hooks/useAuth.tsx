import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAppUrl } from "@/lib/app-url";
import type { User, Session } from "@supabase/supabase-js";

// ─── Demo accounts (bypass Supabase — no env vars needed) ─────────────────────
const DEMO_PASSWORD = "moto2026";
const DEMO_SESSION_KEY = "motokah_demo_session";

const DEMO_ACCOUNTS: Record<string, { role: "admin" | "dealer" | "private"; name: string; dealerName?: string }> = {
  "admin@motokah.com":  { role: "admin",   name: "Motokah Admin" },
  "dealer@motokah.com": { role: "dealer",  name: "Safari Motors", dealerName: "Safari Motors" },
  "user@motokah.com":   { role: "private", name: "Demo User" },
};

function makeDemoUser(email: string, name: string): User {
  return {
    id: `demo-${email.split("@")[0]}`,
    email,
    email_confirmed_at: "2026-01-01T00:00:00Z",
    confirmed_at: "2026-01-01T00:00:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    user_metadata: { display_name: name },
    app_metadata: {},
    aud: "authenticated",
    role: "authenticated",
    identities: [],
    factors: [],
    phone: "",
    last_sign_in_at: "2026-01-01T00:00:00Z",
  } as unknown as User;
}
// ──────────────────────────────────────────────────────────────────────────────

interface UserProfile {
  seller_type: "private" | "dealer";
  display_name: string | null;
  verified_at: string | null;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: UserProfile | null;
  isAdmin: boolean;
  isDealer: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const [{ data: profileData }, { data: roleRows }] = await Promise.all([
        supabase
          .from("profiles")
          .select("seller_type, display_name, verified_at, phone, city, avatar_url")
          .eq("user_id", userId)
          .single(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin"),
      ]);
      if (profileData) setProfile(profileData as UserProfile);
      setIsAdmin(Array.isArray(roleRows) && roleRows.length > 0);
    } catch {
      // Supabase unavailable — profile stays null, not admin
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    // Check for persisted demo session first (no network needed)
    const stored = localStorage.getItem(DEMO_SESSION_KEY);
    if (stored) {
      try {
        const { user: demoUser, profile: demoProfile, isAdmin: demoAdmin } = JSON.parse(stored);
        setUser(demoUser);
        setProfile(demoProfile);
        setIsAdmin(demoAdmin);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(DEMO_SESSION_KEY);
      }
    }

    // Normal Supabase auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const demo = DEMO_ACCOUNTS[email.toLowerCase().trim()];
    if (demo && password === DEMO_PASSWORD) {
      const demoUser = makeDemoUser(email.toLowerCase().trim(), demo.name);
      const demoProfile: UserProfile = {
        seller_type: demo.role === "dealer" ? "dealer" : "private",
        display_name: demo.dealerName ?? demo.name,
        verified_at: "2026-01-01T00:00:00Z",
        phone: "+255 700 000 000",
        city: "Dar es Salaam",
        avatar_url: null,
      };
      const demoAdmin = demo.role === "admin";
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ user: demoUser, profile: demoProfile, isAdmin: demoAdmin }));
      setUser(demoUser);
      setProfile(demoProfile);
      setIsAdmin(demoAdmin);
      setLoading(false);
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: new Error(error.message) };
      return { error: null };
    } catch {
      return { error: new Error("Connection failed. Check your internet and try again.") };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email },
          emailRedirectTo: getAppUrl('/auth?verified=1'),
        },
      });
      if (error) return { error: new Error(error.message) };
      return { error: null };
    } catch {
      return { error: new Error("Connection failed. Check your internet and try again.") };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore if Supabase unavailable
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAppUrl('/reset-password'),
      });
      return { error: error as Error | null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const isDealer = profile?.seller_type === "dealer";

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      profile, isAdmin, isDealer,
      signUp, signIn, signOut, resetPassword, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
