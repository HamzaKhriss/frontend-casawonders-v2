// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { getProfile, loginUser, logoutUser } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/wishlist"];
// Routes that should redirect to home if already logged in
const AUTH_ONLY_ROUTES = ["/login", "/register"];

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  setUser: (u: UserProfile | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  requireAuth: (action?: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  signIn: async () => {},
  signOut: async () => {},
  requireAuth: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Au montage, tenter de récupérer le profil utilisateur ─────────────────
  useEffect(() => {
    if (!router.isReady) return;

    // Toujours tenter de récupérer le profil s'il existe
    (async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        // Pas de profil, c'est OK - l'utilisateur peut naviguer sans être connecté
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [router.isReady]);

  // ─── Guard : protéger certaines routes et rediriger les utilisateurs connectés des pages d'auth
  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = PROTECTED_ROUTES.includes(router.pathname);
    const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(router.pathname);

    // Rediriger vers login si tentative d'accès à une route protégée sans être connecté
    if (!user && isProtectedRoute) {
      router.replace("/login?redirect=" + encodeURIComponent(router.pathname));
    }
    // Rediriger vers home si déjà connecté et sur une page d'authentification
    else if (user && isAuthOnlyRoute) {
      const redirect = router.query.redirect as string;
      router.replace(redirect || "/");
    }
  }, [loading, user, router.pathname]);

  // ─── Méthodes d’authentification ───────────────────────────────
  const signIn = async (email: string, password: string) => {
    // loginUser pose le cookie + stocke le JWT en fallback
    await loginUser({ email, password });
    // on refetch le profil via authFetch
    const profile = await getProfile();
    setUser(profile);
    await router.replace("/");
  };

  const signOut = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    } finally {
      setUser(null);
      // nettoie les tokens locaux
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        delete (window as any).__JWT;
      }
      // redirige vers login
      await router.replace("/login");
    }
  };

  // ─── Utilitaire pour vérifier l'authentification avant une action ──────────
  const requireAuth = (action?: string): boolean => {
    if (!user) {
      // Construire l'URL de redirection avec l'action si fournie
      const currentPath = router.asPath;
      let redirectUrl = "/login";

      if (currentPath !== "/") {
        redirectUrl += "?redirect=" + encodeURIComponent(currentPath);
      }

      if (action) {
        const separator = redirectUrl.includes("?") ? "&" : "?";
        redirectUrl += separator + "action=" + encodeURIComponent(action);
      }

      router.push(redirectUrl);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, signIn, signOut, requireAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
