import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useUser, useClerk } from "@clerk/react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

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
  signUp: (details: { name: string; email: string; password: string; memberType: AuthUser["memberType"] }) => Promise<{ success: boolean; error?: string }>;
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

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const LOCAL_USERS_KEY = "papi_local_users_v1";
const LOCAL_SESSION_KEY = "papi_local_session_v1";

type LocalStoredUser = AuthUser & {
  password: string;
};

function readLocalUsers(): LocalStoredUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: LocalStoredUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function toPublicUser(user: LocalStoredUser): AuthUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

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

function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  const user: AuthUser | null = clerkUser
    ? {
        id: clerkUser.id,
        name:
          clerkUser.fullName ||
          clerkUser.username ||
          clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "Member",
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        memberSince: clerkUser.createdAt
          ? new Date(clerkUser.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        memberType: "individual",
        imageUrl: clerkUser.imageUrl ?? null,
      }
    : null;

  const logout = () => signOut({ redirectUrl: basePath || "/" });
  const signIn: AuthContextValue["signIn"] = async () => ({
    success: false,
    error: "Use the hosted Clerk sign-in flow when Clerk is enabled.",
  });
  const signUp: AuthContextValue["signUp"] = async () => ({
    success: false,
    error: "Use the hosted Clerk sign-up flow when Clerk is enabled.",
  });

  return (
    <AuthShell user={user} isLoaded={isLoaded} logout={logout} signIn={signIn} signUp={signUp}>
      {children}
    </AuthShell>
  );
}

function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const sessionUserId = localStorage.getItem(LOCAL_SESSION_KEY);
      const users = readLocalUsers();
      const active = users.find((u) => u.id === sessionUserId);
      setUser(active ? toPublicUser(active) : null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const persistUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(LOCAL_SESSION_KEY, nextUser.id);
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const signIn: AuthContextValue["signIn"] = useCallback(async ({ email, password }) => {
    const users = readLocalUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const match = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.password === password);
    if (!match) {
      return { success: false, error: "Invalid email or password." };
    }
    persistUser(toPublicUser(match));
    return { success: true };
  }, [persistUser]);

  const signUp: AuthContextValue["signUp"] = useCallback(async ({ name, email, password, memberType }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readLocalUsers();
    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser: LocalStoredUser = {
      id: globalThis.crypto?.randomUUID?.() ?? `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      memberSince: new Date().toISOString().split("T")[0],
      memberType,
      imageUrl: null,
    };

    const nextUsers = [...users, newUser];
    writeLocalUsers(nextUsers);
    persistUser(toPublicUser(newUser));
    return { success: true };
  }, [persistUser]);

  useEffect(() => {
    setAuthTokenGetter(() => {
      if (!user) return null;
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        memberSince: user.memberSince,
        memberType: user.memberType,
      };
      return `local:${encodeURIComponent(JSON.stringify(payload))}`;
    });

    return () => {
      setAuthTokenGetter(null);
    };
  }, [user]);

  return (
    <AuthShell user={user} isLoaded={isLoaded} logout={logout} signIn={signIn} signUp={signUp}>
      {children}
    </AuthShell>
  );
}

export function AuthProvider({
  children,
  mode = "clerk",
}: {
  children: ReactNode;
  mode?: "clerk" | "local";
}) {
  return mode === "clerk" ? (
    <ClerkAuthProvider>{children}</ClerkAuthProvider>
  ) : (
    <LocalAuthProvider>{children}</LocalAuthProvider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}
