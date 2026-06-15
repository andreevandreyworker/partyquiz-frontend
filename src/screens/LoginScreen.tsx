import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { errKey } from "../errors";
import LangToggle from "../components/LangToggle";

type Mode = "guest" | "login" | "register";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("guest");
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const finish = (token: string, uid: string, lg: string) => {
    signIn(token, uid, lg);
    navigate("/");
  };

  const playAsGuest = async () => {
    setError("");
    setBusy(true);
    try {
      const tokens = await api.guest(name.trim());
      finish(tokens.access_token, tokens.user_id, tokens.login);
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setBusy(false);
    }
  };

  const submitAccount = async () => {
    setError("");
    setBusy(true);
    try {
      const fn = mode === "login" ? api.login : api.register;
      const tokens = await fn(login.trim(), password);
      finish(tokens.access_token, tokens.user_id, tokens.login);
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div className="title">{t("app_title")}</div>
        <LangToggle />
      </div>
      <div className="spacer" />

      {mode === "guest" ? (
        <>
          <div className="card">
            <input
              placeholder={t("your_name")}
              value={name}
              maxLength={64}
              onChange={(e) => setName(e.target.value)}
            />
            {error && (
              <div className="error" style={{ marginTop: 12 }}>
                {error}
              </div>
            )}
          </div>
          <button
            disabled={busy || name.trim().length < 2}
            onClick={playAsGuest}
          >
            {t("play")}
          </button>
          <button
            className="ghost"
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            {t("use_account")}
          </button>
        </>
      ) : (
        <>
          <div className="card">
            <input
              placeholder={t("login")}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoCapitalize="none"
            />
            <div style={{ height: 12 }} />
            <input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <div className="error" style={{ marginTop: 12 }}>
                {error}
              </div>
            )}
          </div>
          <button
            disabled={busy || !login || !password}
            onClick={submitAccount}
          >
            {mode === "login" ? t("sign_in") : t("sign_up")}
          </button>
          <button
            className="ghost"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? t("to_register") : t("to_login")}
          </button>
          <button
            className="ghost"
            onClick={() => {
              setMode("guest");
              setError("");
            }}
          >
            {t("use_guest")}
          </button>
        </>
      )}
      <div className="spacer" />
    </div>
  );
}
