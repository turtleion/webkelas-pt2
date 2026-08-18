import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * Lapisan data auth — satu-satunya tempat menyentuh Supabase Auth.
 *
 * - Google OAuth adalah satu-satunya alur masuk (email OTP dihapus).
 * - Mode tamu (guest) disimpan lokal, bukan anonim Supabase.
 *   "pengunjung" hanyalah penanda di sisi frontend agar halaman
 *   terlindungi bisa dibuka tanpa akun — tidak ada baris di DB.
 * - `user` kembali null bila tidak ada sesi, untuk mencegah kebocoran
 *   sesi pengguna lain bila navigasi terjadi.
 */

export const GUEST_ID = "guest";
export type Role = "admin" | "member" | "owner";

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role: Role;
  guest: boolean;
};

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
}

let cachedGuest: boolean | null = null;

export function isGuestStored() {
  if (cachedGuest === null) {
    try {
      cachedGuest = localStorage.getItem("arsip_guest") === "1";
    } catch {
      cachedGuest = false;
    }
  }
  return cachedGuest;
}

function setGuestStored(value: boolean) {
  cachedGuest = value;
  try {
    if (value) localStorage.setItem("arsip_guest", "1");
    else localStorage.removeItem("arsip_guest");
  } catch {
    /* abaikan — mode privat tetap jalan per sesi */
  }
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signInAsGuest() {
  // hanya membalik bendera lokal; tidak ada akun anonim Supabase
  setGuestStored(true);
}

export async function signOut() {
  setGuestStored(false);
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

async function mapUser(user: User | null): Promise<AuthUser | null> {
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, image, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // profil gagal dibaca — jangan bawa sesi tanpa identitas
    return null;
  }

  const row = data as
    | { id: string; name: string | null; image: string | null; email: string | null; role: string | null }
    | null;

  let role: Role = "member";
  if (row?.role === "owner") {
    role = "owner";
  } else if (row?.role === "admin") {
    role = "admin";
  }

  return {
    id: user.id,
    email: row?.email ?? user.email ?? null,
    name: row?.name ?? user.user_metadata?.["name"] ?? null,
    image: row?.image ?? user.user_metadata?.["avatar_url"] ?? null,
    role,
    guest: false,
  };
}

export async function getAuthState(): Promise<AuthState> {
  const guest = isGuestStored();
  if (guest) {
    return { isLoading: false, isAuthenticated: true, user: { id: GUEST_ID, role: "member", guest: true } };
  }
  const { data } = await supabase.auth.getSession();
  if (!data.session) return { isLoading: false, isAuthenticated: false, user: null };
  const user = await mapUser(data.session.user);
  return { isLoading: false, isAuthenticated: user !== null, user };
}

export async function getUser(): Promise<AuthUser | null> {
  if (isGuestStored()) return { id: GUEST_ID, role: "member", guest: true };
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  return mapUser(data.session.user);
}

export type AuthChangeHandler = (state: AuthState) => void;
export type Unsubscribe = () => void;

export function onAuthChange(handler: AuthChangeHandler): Unsubscribe {
  let sent = false;
  let disposed = false;
  const emit = async () => {
    if (disposed) return;
    const state = await getAuthState();
    if (!disposed) handler(state);
  };
  const { data } = supabase.auth.onAuthStateChange(() => {
    // Debounce berantai agar isi ulang sesi tidak memicu dua kali.
    if (sent) return;
    sent = true;
    setTimeout(() => {
      sent = false;
      void emit();
    }, 50);
  });
  void emit();
  return () => {
    disposed = true;
    data.subscription.unsubscribe();
  };
}
