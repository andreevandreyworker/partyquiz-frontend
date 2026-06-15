import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { clearToken, setToken } from "./api";

interface AuthState {
  userId: string | null;
  login: string | null;
  authed: boolean;
  signIn: (token: string, userId: string, login: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("pq_user_id"),
  );
  const [login, setLogin] = useState<string | null>(
    localStorage.getItem("pq_login"),
  );

  const signIn = (token: string, uid: string, lg: string) => {
    setToken(token);
    localStorage.setItem("pq_user_id", uid);
    localStorage.setItem("pq_login", lg);
    setUserId(uid);
    setLogin(lg);
  };

  const signOut = () => {
    clearToken();
    localStorage.removeItem("pq_user_id");
    localStorage.removeItem("pq_login");
    setUserId(null);
    setLogin(null);
  };

  return (
    <AuthContext.Provider
      value={{ userId, login, authed: !!userId, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
