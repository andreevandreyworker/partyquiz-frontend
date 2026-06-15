import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { setLang } from "../i18n";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, isGuest, signOut } = useAuth();

  return (
    <div className="screen">
      <div className="topbar">
        <button
          className="ghost langtoggle"
          onClick={() => navigate("/")}
        >
          {t("back")}
        </button>
        <div className="title">{t("settings")}</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="spacer" />

      <div className="list-section">{t("account")}</div>
      <div
        className="list-row"
        onClick={() => navigate("/profile")}
      >
        <span>{isGuest ? t("guest_label") : login}</span>
        <span className="chevron">›</span>
      </div>

      <div className="list-section">{t("language")}</div>
      <div className="seg">
        <button
          className={`seg-btn ${i18n.language === "ru" ? "on" : ""}`}
          onClick={() => setLang("ru")}
        >
          Русский
        </button>
        <button
          className={`seg-btn ${i18n.language === "en" ? "on" : ""}`}
          onClick={() => setLang("en")}
        >
          English
        </button>
      </div>

      <div className="list-section">{t("about")}</div>
      <div className="meta" style={{ padding: "0 4px" }}>
        {t("about_text")}
      </div>

      <div className="spacer" />
      <button className="ghost" onClick={signOut}>
        {t("logout")}
      </button>
    </div>
  );
}
