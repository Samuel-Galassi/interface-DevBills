import { createContext } from "react";
import type { AuthState } from "../../types/auth";

interface AuthContextProps {
  authState: AuthState;
  signWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);