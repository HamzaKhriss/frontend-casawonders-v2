// lib/auth.ts — cookie HttpOnly + header Bearer + stockage local + authFetch

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-flask-54ae.onrender.com/api";

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  profile_picture_url?: string;
  role: string;
  registration_date: string;
  last_login_date?: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
}

interface LoginResponse extends UserProfile {
  access_token: string;
}

// ─── Inscription ─────────────────────────────────────────────────────
export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, role: "user" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `Register failed (${res.status})`);
  }
  return res.json();
}

// ─── Connexion ───────────────────────────────────────────────────────
export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `Login failed (${res.status})`);
  }

  const data: LoginResponse = await res.json();
  // stocke le token en mémoire et localStorage
  if (typeof window !== "undefined" && data.access_token) {
    (window as any).__JWT = data.access_token;
    localStorage.setItem("access_token", data.access_token);
  }

  const { access_token, ...profile } = data;
  return profile;
}

// ─── Déconnexion ────────────────────────────────────────────────────
export async function logoutUser() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }).catch(console.warn);

  if (typeof window !== "undefined") {
    delete (window as any).__JWT;
    localStorage.removeItem("access_token");
  }

  return { success: true };
}

// ─── authFetch : wrapper pour tous les appels protégés ─────────────
export function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (typeof window !== "undefined") {
    const token =
      (window as any).__JWT || localStorage.getItem("access_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
}

// ─── Récupérer le profil (protégé) ─────────────────────────────────
export async function getProfile(): Promise<UserProfile> {
  const res = await authFetch(`${API_BASE}/user/profile`);
  if (!res.ok) {
    if (res.status === 401) throw new Error("Not authenticated");
    throw new Error(`Error fetching profile (${res.status})`);
  }
  return res.json();
}

// … juste après cancelBooking()

/**
 * Change the user password.
 * Le cookie HttpOnly sera automatiquement renvoyé par authFetch.
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  const qs = `old_password=${encodeURIComponent(oldPassword)}&new_password=${encodeURIComponent(newPassword)}`;
  const res = await authFetch(
    `${API_BASE}/user/change-password?${qs}`,
    { method: "POST" }
  );
  if (!res.ok) {
    // récupère le message d’erreur qu’envoie FastAPI
    const errText = await res.text().catch(() => null);
    throw new Error(errText || `HTTP ${res.status}`);
  }
};

