import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAppUrl } from "@/lib/app-url";
import { notifyAdminsOnNewSignup } from "@/lib/sendEmail";
import { syncBlockedSellersFromServer } from "@/lib/blockedSellers";
import { trackEvent } from "@/lib/analytics";
import type { User, Session } from "@supabase/supabase-js";

export const ADMIN_EMAILS = [
  "admin@motokah.com",
  "weeedi420@gmail.com",
  "info@motokah.com",
  "support@motokah.com",
  // Real, currently-used Owner login — found live 2026-11-13 that this
  // hardcoded list had never included an actual registered account, and
  // user_roles (the server-side RLS source for has_role()) was completely
  // empty, so the Owner had no real admin access to any RLS-gated admin data
  // despite ADMIN_EMAILS theoretically covering the UI shell. Also granted a
  // real user_roles row for this account — see migration/commit for details.
  "1pointsolutionsltd@gmail.com",
];

export function checkUserIsAdmin(user: User | null, roleRows?: any[]): boolean {
  if (!user) return false;
  const email = (user.email || "").toLowerCase().trim();
  // Explicit list only: a blanket @motokah.com rule made the App Review test account an admin.
  if (ADMIN_EMAILS.includes(email)) return true;
  if (user.user_metadata?.role === "admin" || user.app_metadata?.role === "admin") return true;
  if (Array.isArray(roleRows) && roleRows.length > 0) return true;
  return false;
}

// Former client-side demo login; cleared so old sessions don't linger on devices.
const DEMO_SESSION_KEY = "motokah_demo_session";

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
  deleteAccount: () => Promise<{ error: Error | null }>;
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
      setIsAdmin(checkUserIsAdmin(user, roleRows));
    } catch {
      setIsAdmin(checkUserIsAdmin(user));
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    localStorage.removeItem("motokah_admin_override");

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(checkUserIsAdmin(session.user));
        setTimeout(() => fetchProfile(session.user.id), 0);
        syncBlockedSellersFromServer(session.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(checkUserIsAdmin(session.user));
        fetchProfile(session.user.id);
        syncBlockedSellersFromServer(session.user.id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: new Error(error.message) };
      trackEvent("sign_in");
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

      // Dispatch alert to owners
      const adminNotified = await notifyAdminsOnNewSignup({
        email,
        displayName,
      }).catch(() => false);
      if (!adminNotified) console.warn("Signup succeeded, but the admin email was not accepted");

      trackEvent("sign_up");

      return { error: null };
    } catch {
      return { error: new Error("Connection failed. Check your internet and try again.") };
    }
  };

  const signOut = async () => {
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

  const deleteAccount = async () => {
    if (!user) return { error: new Error("You must be signed in to delete your account.") };

    const accessToken = session?.access_token;
    if (!accessToken) return { error: new Error("Your session has expired. Please sign in again.") };

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) return { error: new Error(result.error || "Could not delete your account.") };
      await signOut();
      return { error: null };
    } catch {
      return { error: new Error("Connection failed. Please try again.") };
    }
  };

  const isDealer = profile?.seller_type === "dealer";

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      profile, isAdmin, isDealer,
      signUp, signIn, signOut, resetPassword, deleteAccount, refreshProfile,
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
