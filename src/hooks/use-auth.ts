import { useEffect, useState } from "react";
import {
  getAuthState,
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
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
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
