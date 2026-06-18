import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../auth";
import { setLang } from "../i18n";
import { spring, container, item, haptic } from "../motion";
import Mascot from "../components/Mascot";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { login, isPremium, isGuest } = useAuth();
  const navigate = useNavigate();

  const next = i18n.language === "ru" ? "en" : "ru";
  const name = isGuest ? t("guest_label") : login;

  const raw = t("teaser_items", { returnObjects: true });
  const items = Array.isArray(raw) ? (raw as string[]) : [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % items.length),
      2800
    );
    return () => clearInterval(id);
  }, [items.length]);

  const go = (path: string) => {
    haptic(10);
    navigate(path);
  };

  return (
    <motion.div
      className="screen pq-home"
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
        <motion.button
          className="pq-account"
          whileTap={{ scale: 0.92 }}
          transition={spring.snappy}
          onClick={() => go("/profile")}
        >
          <span className="pq-cat-mini">🐱</span>
          {name}
          {isPremium && <span className="pq-star">★</span>}
        </motion.button>
      </motion.div>

      <motion.div className="pq-logo" variants={item}>
        <motion.div
          className="pq-logo-top"
          initial={{ x: -40, opacity: 0, rotate: -4 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ ...spring.bouncy, delay: 0.15 }}
        >
          {t("logo_top")}
        </motion.div>
        <div className="pq-or">
          <span className="pq-or-line" />
          {t("logo_or")}
          <span className="pq-or-line" />
        </div>
        <motion.div
          className="pq-logo-bottom"
          initial={{ x: 40, opacity: 0, rotate: 4 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ ...spring.bouncy, delay: 0.24 }}
        >
          {t("logo_bottom")}
        </motion.div>
      </motion.div>

      <motion.div className="pq-hero" variants={item}>
        <Mascot size={168} />
      </motion.div>

      <motion.div className="pq-sheet" variants={item}>
        <div className="pq-teaser" aria-hidden="true">
          <span className="pq-teaser-label">{t("teaser_label")}</span>
          <div className="pq-teaser-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                className="pq-teaser-text"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                {items[idx] ?? ""}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="pq-teaser-chips">
            <span className="pq-chip pq-chip-norm">{t("chip_norm")}</span>
            <span className="pq-chip pq-chip-strem">{t("chip_strem")}</span>
          </div>
        </div>

        <motion.button
          className="pq-btn-primary"
          whileTap={{ scale: 0.96 }}
          transition={spring.snappy}
          onClick={() => go("/categories?mode=multi")}
        >
          <span className="pq-ic">＋</span>
          {t("create_room")}
        </motion.button>

        <motion.button
          className="pq-btn-light"
          whileTap={{ scale: 0.96 }}
          transition={spring.snappy}
          onClick={() => go("/join")}
        >
          <span className="pq-ic">⇥</span>
          {t("enter_room")}
        </motion.button>

        <motion.button
          className="pq-btn-text"
          whileTap={{ scale: 0.96 }}
          transition={spring.snappy}
          onClick={() => go("/categories?mode=solo")}
        >
          <span className="pq-ic-sm">👤</span>
          {t("solo")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
