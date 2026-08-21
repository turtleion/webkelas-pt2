import { useEffect, useState } from "react";
import {
  getAuthState,
  GUEST_ID,
  isGuestStored,
  onAuthChange,
  signInAsGuest,
  signInWithGoogle,
  signOut,
  type AuthState,
} from "@/lib/auth";

export type UseAuthReturn = AuthState & {
  isAdmin: boolean;
  isOwner: boolean;
  isVerified: boolean;
  signIn: typeof signInWithGoogle;
  signInAsGuest: typeof signInAsGuest;
  signOut: typeof signOut;
};

export function useAuth(): UseAuthReturn {
  // Initial state sinkron. Guest flag hanya dipakai kalau TIDAK ada sesi
  // Supabase yang valid — Supabase session selalu menang. Cek sesi dari
  // cache lokal Supabase (sinkron) untuk membedakan.
  const [state, setState] = useState<AuthState>(() => {
    // Pakai synchronous Supabase session lookup kalau memungkinkan.
    // supabase.auth.getSession() sebenarnya async, jadi di initial state
    // kita pakai guest flag sebagai fallback cepat — useEffect akan
    // merefresh state begitu Supabase resolve. Untuk kebanyakan kasus
    // (Google user sudah signed in), session tersedia di cache Supabase
    // JS dan getSession() akan resolve cepat.
    if (isGuestStored()) {
      return {
        isLoading: false,
        isAuthenticated: true,
        user: {
          id: GUEST_ID,
          role: "member",
          guest: true,
          verified: false,
        },
      };
    }
    return {
      isLoading: true,
      isAuthenticated: false,
      user: null,
    };
  });

  useEffect(() => {
    let mounted = true;
    void getAuthState().then((s) => {
      if (mounted) setState(s);
    });
    const unsub = onAuthChange((s) => {
      if (mounted) setState(s);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const role = state.user?.role;
  const isOwner = !state.user?.guest && role === "owner";
  const isAdmin = !state.user?.guest && (role === "admin" || role === "owner");
  const isVerified = !state.user?.guest && state.user?.verified === true;

  return {
    ...state,
    isAdmin,
    isOwner,
    isVerified,
    signIn: signInWithGoogle,
    signInAsGuest,
    signOut,
  };
}
