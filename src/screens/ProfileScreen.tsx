import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

function initials(login: string): string {
  const parts = login.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return login.trim().slice(0, 2).toUpperCase();
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isPremium, isGuest, signOut } = useAuth();

  const name = isGuest ? t("guest_label") : login ?? "";

  return (
    <div className="screen">
      <div className="topbar">
        <button
          className="ghost langtoggle"
          onClick={() => navigate("/settings")}
        >
          {t("back")}
        </button>
        <div className="title">{t("profile")}</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="spacer" />

      <div className="profile-head">
        <div className={`avatar-lg ${isPremium ? "premium" : ""}`}>
          {initials(name)}
        </div>
        <div className="profile-name">{name}</div>
        <div className={`plan-pill ${isPremium ? "premium" : ""}`}>
          {isPremium ? t("premium_plan") : t("free_plan")}
        </div>
      </div>

      <div className="spacer" />

      {isPremium ? (
        <div className="premium-card active">
          <div className="premium-title">{t("premium_active")}</div>
          <ul className="perks">
            <li>✓ {t("premium_perk_hot")}</li>
            <li>✓ {t("premium_perk_ai")}</li>
            <li>✓ {t("premium_perk_codes")}</li>
          </ul>
        </div>
      ) : (
        <div className="premium-card">
          <div className="premium-title">{t("premium_title")}</div>
          <ul className="perks">
            <li>🔓 {t("premium_perk_hot")}</li>
            <li>🤖 {t("premium_perk_ai")}</li>
            <li>🎲 {t("premium_perk_codes")}</li>
          </ul>
          {isGuest ? (
            <>
              <div className="meta" style={{ marginBottom: 12 }}>
                {t("account_required")}
              </div>
              <button
                onClick={() => {
                  signOut();
                  navigate("/login");
                }}
              >
                {t("create_account")}
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/premium")}>
              {t("go_premium")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
