import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { login, isPremium, isGuest } = useAuth();
  const navigate = useNavigate();

  const name = isGuest ? t("guest_label") : login;

  return (
    <div className="screen">
      <div className="topbar">
        <div className="title">{t("app_title")}</div>
        <button
          className="icon-btn"
          onClick={() => navigate("/settings")}
          aria-label={t("settings")}
        >
          ⚙
        </button>
      </div>
      <div
        className="meta profile-link"
        onClick={() => navigate("/profile")}
      >
        {name}
        {isPremium && <span className="mini-plan">★</span>}
      </div>
      <div className="spacer" />
      <button onClick={() => navigate("/categories?mode=multi")}>
        {t("create_room")}
      </button>
      <button className="secondary" onClick={() => navigate("/join")}>
        {t("join_room")}
      </button>
      <button
        className="secondary"
        onClick={() => navigate("/categories?mode=solo")}
      >
        {t("solo")}
      </button>
      <div className="spacer" />
    </div>
  );
}
