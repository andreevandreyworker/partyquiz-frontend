import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import LangToggle from "../components/LangToggle";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { login, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div className="topbar">
        <div className="title">{t("app_title")}</div>
        <LangToggle />
      </div>
      <div className="meta">{login}</div>
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
      <button className="ghost" onClick={signOut}>
        {t("logout")}
      </button>
    </div>
  );
}
