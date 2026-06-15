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
  isPremium: boolean;
  isGuest: boolean;
  authed: boolean;
  signIn: (
    token: string,
    userId: string,
    login: string,
    isPremium: boolean,
    isAccount: boolean,
  ) => void;
  setPremium: (value: boolean) => void;
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
  const [isPremium, setIsPremium] = useState<boolean>(
    localStorage.getItem("pq_premium") === "1",
  );
  const [isGuest, setIsGuest] = useState<boolean>(
    localStorage.getItem("pq_account") !== "1",
  );

  const signIn = (
    token: string,
    uid: string,
    lg: string,
    premium: boolean,
    isAccount: boolean,
  ) => {
    setToken(token);
    localStorage.setItem("pq_user_id", uid);
    localStorage.setItem("pq_login", lg);
    localStorage.setItem("pq_premium", premium ? "1" : "0");
    localStorage.setItem("pq_account", isAccount ? "1" : "0");
    setUserId(uid);
    setLogin(lg);
    setIsPremium(premium);
    setIsGuest(!isAccount);
  };

  const setPremium = (value: boolean) => {
    localStorage.setItem("pq_premium", value ? "1" : "0");
    setIsPremium(value);
  };

  const signOut = () => {
    clearToken();
    localStorage.removeItem("pq_user_id");
    localStorage.removeItem("pq_login");
    localStorage.removeItem("pq_premium");
    localStorage.removeItem("pq_account");
    setUserId(null);
    setLogin(null);
    setIsPremium(false);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        login,
        isPremium,
        isGuest,
        authed: !!userId,
        signIn,
        setPremium,
        signOut,
      }}
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
