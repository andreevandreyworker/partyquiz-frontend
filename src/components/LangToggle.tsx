import { useTranslation } from "react-i18next";
import { setLang } from "../i18n";

export default function LangToggle() {
  const { i18n } = useTranslation();
  const next = i18n.language === "ru" ? "en" : "ru";
  return (
    <button className="langtoggle" onClick={() => setLang(next)}>
      {i18n.language === "ru" ? "EN" : "RU"}
    </button>
  );
}
