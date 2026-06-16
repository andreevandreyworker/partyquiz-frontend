import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { errKey } from "../errors";

const PERKS = [
  { icon: "🔥", t: "perk_hot_t", d: "perk_hot_d" },
  { icon: "🤖", t: "perk_ai_t", d: "perk_ai_d" },
  { icon: "🎲", t: "perk_codes_t", d: "perk_codes_d" },
  { icon: "🚫", t: "perk_noads_t", d: "perk_noads_d" },
  { icon: "👥", t: "perk_rooms_t", d: "perk_rooms_d" },
  { icon: "⭐", t: "perk_badge_t", d: "perk_badge_d" },
];

export default function PremiumScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPremium, isGuest, signIn, signOut } = useAuth();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const buy = async () => {
    setBusy(true);
    setError("");
    try {
      const tk = await api.upgrade();
      signIn(
        tk.access_token,
        tk.user_id,
        tk.login,
        tk.is_premium,
        true,
      );
      navigate("/profile");
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen paywall">
      <div className="topbar">
        <button
          className="ghost langtoggle"
          onClick={() => navigate(-1)}
        >
          {t("back")}
        </button>
        <div className="title">{t("premium_title")}</div>
        <div style={{ width: 44 }} />
      </div>

      <div className="paywall-hero">
        <div className="paywall-crown">👑</div>
        <div className="paywall-sub">{t("premium_subtitle")}</div>
      </div>

      <div className="list-section">{t("whats_included")}</div>
      <div className="perk-grid">
        {PERKS.map((p) => (
          <div className="perk-item" key={p.t}>
            <div className="perk-icon">{p.icon}</div>
            <div>
              <div className="perk-t">{t(p.t)}</div>
              <div className="perk-d">{t(p.d)}</div>
            </div>
          </div>
        ))}
      </div>

      {isPremium ? (
        <div className="premium-card active" style={{ marginTop: 18 }}>
          <div className="premium-title">{t("premium_active")}</div>
        </div>
      ) : (
        <>
          <div className="list-section">{t("status")}</div>
          <div className="plan-grid">
            <button
              className={`plan-opt ${plan === "monthly" ? "on" : ""}`}
              onClick={() => setPlan("monthly")}
            >
              <div className="plan-name">{t("plan_monthly")}</div>
              <div className="plan-price">
                {t("price_monthly")}
                <span>{t("per_month")}</span>
              </div>
            </button>
            <button
              className={`plan-opt ${plan === "yearly" ? "on" : ""}`}
              onClick={() => setPlan("yearly")}
            >
              <div className="plan-badge">{t("best_value")}</div>
              <div className="plan-name">{t("plan_yearly")}</div>
              <div className="plan-price">
                {t("price_yearly")}
                <span>{t("per_year")}</span>
              </div>
              <div className="plan-save">{t("yearly_save")}</div>
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {isGuest ? (
            <div className="paywall-cta">
              <div className="meta" style={{ marginBottom: 12 }}>
                🔒 {t("premium_only_registered")}
              </div>
              <button
                onClick={() => {
                  signOut();
                  navigate("/login");
                }}
              >
                {t("create_account")}
              </button>
            </div>
          ) : (
            <div className="paywall-cta">
              <button
                className="buy-btn"
                disabled={busy}
                onClick={buy}
              >
                {busy ? t("activating") : t("premium_cta")}
              </button>
            </div>
          )}
        </>
      )}
      <div className="spacer" />
    </div>
  );
}
