import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { supabase } from "@/lib/supabaseClient";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  memberType: "individual" | "organization" | "volunteer";
  imageUrl: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoaded: boolean;
  logout: () => void;
  signIn: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signUp: (details: { name: string; email: string; password: string; memberType: AuthUser["memberType"]; country?: string }) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  followProject: (projectId: number) => void;
  unfollowProject: (projectId: number) => void;
  isFollowing: (projectId: number) => boolean;
}

const fallbackAuthContext: AuthContextValue = {
  user: null,
  isLoaded: true,
  logout: () => {},
  signIn: async () => ({
    success: false,
    error: "Authentication is unavailable outside AuthProvider.",
  }),
  signUp: async () => ({
    success: false,
    error: "Authentication is unavailable outside AuthProvider.",
  }),
  followProject: () => {},
  unfollowProject: () => {},
  isFollowing: () => false,
};

const AuthContext = createContext<AuthContextValue>(fallbackAuthContext);

function AuthShell({
  children,
  user,
  isLoaded,
  logout,
  signIn,
  signUp,
}: {
  children: ReactNode;
  user: AuthUser | null;
  isLoaded: boolean;
  logout: () => void;
  signIn: AuthContextValue["signIn"];
  signUp: AuthContextValue["signUp"];
}) {
  const [followed, setFollowed] = useState<number[]>([]);
  const storageKey = user ? `papi_followed_${user.id}` : null;

  useEffect(() => {
    if (!storageKey) {
      setFollowed([]);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      setFollowed(raw ? JSON.parse(raw) : []);
    } catch {
      setFollowed([]);
    }
  }, [storageKey]);

  const persist = useCallback(
    (next: number[]) => {
      setFollowed(next);
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
    },
    [storageKey],
  );

  const followProject = (projectId: number) =>
    persist([...new Set([...followed, projectId])]);
  const unfollowProject = (projectId: number) =>
    persist(followed.filter((id) => id !== projectId));
  const isFollowing = (projectId: number) => followed.includes(projectId);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        logout,
        signIn,
        signUp,
        followProject,
        unfollowProject,
        isFollowing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Member",
          email: session.user.email || "",
          memberSince: session.user.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          memberType: session.user.user_metadata?.memberType || "individual",
          imageUrl: session.user.user_metadata?.avatarUrl || null,
        });
      } else {
        setUser(null);
      }
      setIsLoaded(true);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Member",
          email: session.user.email || "",
          memberSince: session.user.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          memberType: session.user.user_metadata?.memberType || "individual",
          imageUrl: session.user.user_metadata?.avatarUrl || null,
        });
      } else {
        setUser(null);
      }
      setIsLoaded(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const signIn: AuthContextValue["signIn"] = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }, []);

  const signUp: AuthContextValue["signUp"] = useCallback(async ({ name, email, password, memberType, country }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name.trim(),
          memberType,
          country: (country || "Unknown").trim(),
        },
      },
    });
    if (error) {
      return { success: false, error: error.message };
    }

    try {
      await fetch("/api/community/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-requested-with": "XMLHttpRequest",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          country: (country || "Unknown").trim(),
          memberType: memberType || "individual",
          bio: "Registered as a foundation member.",
        }),
      });
    } catch (e) {
      console.error("Auto-joining community failed:", e);
    }

    return { success: true, needsConfirmation: !!(data.user && !data.session) };
  }, []);

  // Sync token to API client
  useEffect(() => {
    setAuthTokenGetter(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token ?? null;
    });

    return () => {
      setAuthTokenGetter(null);
    };
  }, []);

  return (
    <AuthShell user={user} isLoaded={isLoaded} logout={logout} signIn={signIn} signUp={signUp}>
      {children}
    </AuthShell>
  );
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
  mode?: "clerk" | "local";
}) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}
