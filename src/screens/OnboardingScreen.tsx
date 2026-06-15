import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LangToggle from "../components/LangToggle";

const SLIDES = [
  { emoji: "🎉", title: "ob1_title", text: "ob1_text" },
  { emoji: "🔑", title: "ob2_title", text: "ob2_text" },
  { emoji: "🔥", title: "ob3_title", text: "ob3_text" },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const finish = () => {
    localStorage.setItem("pq_onboarded", "1");
    navigate("/login", { replace: true });
  };

  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  return (
    <div className="screen">
      <div className="topbar">
        <button className="ghost langtoggle" onClick={finish}>
          {t("ob_skip")}
        </button>
        <LangToggle />
      </div>
      <div className="spacer" />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72 }}>{slide.emoji}</div>
        <div className="title" style={{ marginTop: 16 }}>
          {t(slide.title)}
        </div>
        <div
          className="meta"
          style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5 }}
        >
          {t(slide.text)}
        </div>
      </div>
      <div className="spacer" />
      <div
        className="row"
        style={{ justifyContent: "center", marginBottom: 8 }}
      >
        {SLIDES.map((_, i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background:
                i === index ? "var(--accent)" : "var(--card)",
            }}
          />
        ))}
      </div>
      <button onClick={() => (isLast ? finish() : setIndex(index + 1))}>
        {isLast ? t("ob_continue") : t("ob_next")}
      </button>
    </div>
  );
}
