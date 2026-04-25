import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthState } from "../../types/auth";
import { firebaseAuth, googleAuthProvider } from "../../config/firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        console.log(user)
        if(user){
        setAuthState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          error: null,
          loading: false,
        });
      }} else {
        setAuthState({ user: null, error: null, loading: false });
      }
    });

    return unsubscribe;
  }, []);

  const signWithGoogle = async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Login error",
      }));
    }
  };

  const signOut = async () => {
    await firebaseSignOut(firebaseAuth);
  };

  return (
    <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};