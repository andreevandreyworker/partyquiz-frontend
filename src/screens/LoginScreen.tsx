import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { useAuth } from "../auth";
import { errKey } from "../errors";
import { setLang } from "../i18n";
import { spring, container, item, haptic } from "../motion";

type Mode = "guest" | "login" | "register";

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const { signIn, authed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = (location.state as { mode?: Mode } | null)?.mode;
  const [mode, setMode] = useState<Mode>(initialMode ?? "guest");
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const next = i18n.language === "ru" ? "en" : "ru";

  const playAsGuest = async () => {
    setError("");
    setBusy(true);
    haptic(10);
    try {
      const tokens = await api.guest(name.trim());
      signIn(
        tokens.access_token,
        tokens.user_id,
        tokens.login,
        tokens.is_premium,
        false,
      );
      navigate("/");
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setBusy(false);
    }
  };

  const submitAccount = async () => {
    setError("");
    if (login.trim().length < 3) {
      setError(t("err_login_short"));
      return;
    }
    if (password.length < 4) {
      setError(t("err_pass_short"));
      return;
    }
    setBusy(true);
    haptic(10);
    try {
      const fn = mode === "login" ? api.login : api.register;
      const tokens = await fn(login.trim(), password);
      signIn(
        tokens.access_token,
        tokens.user_id,
        tokens.login,
        tokens.is_premium,
        true,
      );
      navigate("/");
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      className="screen pq-auth"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="pq-header" variants={item}>
        <motion.button
          className="pq-lang"
          whileTap={{ scale: 0.9 }}
          transition={spring.snappy}
          onClick={() => {
            haptic(8);
            setLang(next);
          }}
        >
          <span className={`pq-flag pq-flag-${i18n.language === "ru" ? "ru" : "en"}`} />
          {i18n.language === "ru" ? "RU" : "EN"}
          <span className="pq-chev">⌄</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="pq-auth-logo"
        variants={item}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="pq-auth-norm">{t("logo_top")}</span>
        <span className="pq-auth-or">/</span>
        <span className="pq-auth-strem">{t("logo_bottom")}</span>
      </motion.div>

      <motion.div className="pq-auth-card" variants={item}>
        {mode === "guest" ? (
          <>
            <div className="pq-auth-title">{t("play")}</div>
            <input
              className="pq-input"
              placeholder={t("your_name")}
              value={name}
              maxLength={64}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <div className="pq-err">{error}</div>}
            <motion.button
              className="pq-btn-primary"
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              disabled={busy || name.trim().length < 2}
              onClick={playAsGuest}
            >
              {t("play")}
            </motion.button>
            <button
              className="pq-btn-text"
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
            <div className="pq-auth-title">
              {mode === "login" ? t("sign_in") : t("sign_up")}
            </div>
            <input
              className="pq-input"
              placeholder={t("login")}
              value={login}
              maxLength={64}
              onChange={(e) => setLogin(e.target.value)}
              autoCapitalize="none"
            />
            <input
              className="pq-input"
              type="password"
              placeholder={t("password")}
              value={password}
              maxLength={128}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="pq-err">{error}</div>}
            <motion.button
              className="pq-btn-primary"
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              disabled={busy || !login || !password}
              onClick={submitAccount}
            >
              {mode === "login" ? t("sign_in") : t("sign_up")}
            </motion.button>
            <button
              className="pq-btn-text"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? t("to_register") : t("to_login")}
            </button>
            {!authed && (
              <button
                className="pq-btn-text"
                onClick={() => {
                  setMode("guest");
                  setError("");
                }}
              >
                {t("use_guest")}
              </button>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
