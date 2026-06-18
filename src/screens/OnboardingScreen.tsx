import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { setLang } from "../i18n";
import { spring, haptic } from "../motion";

const SLIDES = [
  { emoji: "🎉", title: "ob1_title", text: "ob1_text" },
  { emoji: "🔑", title: "ob2_title", text: "ob2_text" },
  { emoji: "🔥", title: "ob3_title", text: "ob3_text" },
];

export default function OnboardingScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const next = i18n.language === "ru" ? "en" : "ru";

  const finish = () => {
    localStorage.setItem("pq_onboarded", "1");
    navigate("/login", { replace: true });
  };

  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const advance = () => {
    haptic(10);
    if (isLast) finish();
    else setIndex(index + 1);
  };

  return (
    <div className="screen pq-onb">
      <div className="pq-header">
        <button className="pq-back" onClick={finish}>
          {t("ob_skip")}
        </button>
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
      </div>

      <div className="pq-onb-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="pq-onb-slide"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={spring.gentle}
          >
            <motion.div
              className="pq-onb-emoji"
              animate={{ scale: [1, 1.1, 1], rotate: [-4, 4, -4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              {slide.emoji}
            </motion.div>
            <div className="pq-onb-title">{t(slide.title)}</div>
            <div className="pq-onb-text">{t(slide.text)}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pq-dots">
        {SLIDES.map((_, i) => (
          <motion.span
            key={i}
            className={`pq-dot ${i === index ? "on" : ""}`}
            animate={{ width: i === index ? 22 : 8 }}
            transition={spring.snappy}
          />
        ))}
      </div>

      <motion.button
        className="pq-btn-primary"
        whileTap={{ scale: 0.96 }}
        transition={spring.snappy}
        onClick={advance}
      >
        {isLast ? t("ob_continue") : t("ob_next")}
      </motion.button>
    </div>
  );
}
