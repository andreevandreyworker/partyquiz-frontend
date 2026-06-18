import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth";
import { setLang, loadLanguages } from "../i18n";
import { spring, container, item, haptic } from "../motion";

const FALLBACK_LANGS = [
  { code: "ru", name: "Русский", flag: "ru" },
  { code: "en", name: "English", flag: "en" },
];

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, isGuest, signOut } = useAuth();
  const [langs, setLangs] = useState(FALLBACK_LANGS);

  useEffect(() => {
    loadLanguages().then((l) => {
      if (l.length) setLangs(l);
    });
  }, []);

  return (
    <motion.div
      className="screen pq-auth"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="pq-header" variants={item}>
        <motion.button
          className="pq-back"
          whileTap={{ scale: 0.92 }}
          transition={spring.snappy}
          onClick={() => {
            haptic(8);
            navigate("/");
          }}
        >
          ‹ {t("back")}
        </motion.button>
      </motion.div>

      <motion.h1 className="pq-page-title" variants={item}>
        {t("settings")}
      </motion.h1>

      <motion.div className="pq-auth-card" variants={item}>
        <div className="pq-section">{t("account")}</div>
        <button className="pq-row" onClick={() => navigate("/profile")}>
          <span>{isGuest ? t("guest_label") : login}</span>
          <span className="pq-row-chev">›</span>
        </button>

        <div className="pq-section">{t("language")}</div>
        <div className="pq-seg">
          {langs.map((l) => (
            <button
              key={l.code}
              className={`pq-seg-btn ${i18n.language === l.code ? "on" : ""}`}
              onClick={() => {
                haptic(8);
                setLang(l.code);
              }}
            >
              {l.name}
            </button>
          ))}
        </div>

        <div className="pq-section">{t("about")}</div>
        <p className="pq-about">{t("about_text")}</p>
      </motion.div>

      <motion.button
        className="pq-btn-light pq-logout"
        variants={item}
        whileTap={{ scale: 0.96 }}
        transition={spring.snappy}
        onClick={signOut}
      >
        {t("logout")}
      </motion.button>
    </motion.div>
  );
}
