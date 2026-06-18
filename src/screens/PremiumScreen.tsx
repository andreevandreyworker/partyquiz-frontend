import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { useAuth } from "../auth";
import { errKey } from "../errors";
import { spring, container, item, haptic } from "../motion";

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
  const { isPremium, isGuest, signIn } = useAuth();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const buy = async () => {
    setBusy(true);
    setError("");
    haptic(10);
    try {
      const tk = await api.upgrade();
      signIn(tk.access_token, tk.user_id, tk.login, tk.is_premium, true);
      navigate("/profile");
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setBusy(false);
    }
  };

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
            navigate(-1);
          }}
        >
          ‹ {t("back")}
        </motion.button>
      </motion.div>

      <motion.div
        className="pq-paywall-hero"
        variants={item}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="pq-paywall-crown">👑</div>
        <div className="pq-paywall-title">{t("premium_title")}</div>
        <div className="pq-paywall-sub">{t("premium_subtitle")}</div>
      </motion.div>

      <motion.div className="pq-auth-card" variants={item}>
        <div className="pq-section">{t("whats_included")}</div>
        <div className="pq-perk-grid">
          {PERKS.map((p) => (
            <div className="pq-perk-item" key={p.t}>
              <div className="pq-perk-icon">{p.icon}</div>
              <div>
                <div className="pq-perk-t">{t(p.t)}</div>
                <div className="pq-perk-d">{t(p.d)}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {isPremium ? (
        <motion.div className="pq-auth-card" variants={item}>
          <div className="pq-auth-title">{t("premium_active")}</div>
        </motion.div>
      ) : (
        <motion.div className="pq-auth-card" variants={item}>
          <div className="pq-section">{t("status")}</div>
          <div className="pq-plan-grid">
            <button
              className={`pq-plan-opt ${plan === "monthly" ? "on" : ""}`}
              onClick={() => {
                haptic(8);
                setPlan("monthly");
              }}
            >
              <div className="pq-plan-name">{t("plan_monthly")}</div>
              <div className="pq-plan-price">
                {t("price_monthly")}
                <span>{t("per_month")}</span>
              </div>
            </button>
            <button
              className={`pq-plan-opt ${plan === "yearly" ? "on" : ""}`}
              onClick={() => {
                haptic(8);
                setPlan("yearly");
              }}
            >
              <div className="pq-plan-badge">{t("best_value")}</div>
              <div className="pq-plan-name">{t("plan_yearly")}</div>
              <div className="pq-plan-price">
                {t("price_yearly")}
                <span>{t("per_year")}</span>
              </div>
              <div className="pq-plan-save">{t("yearly_save")}</div>
            </button>
          </div>

          {error && <div className="pq-err">{error}</div>}

          {isGuest ? (
            <>
              <p className="pq-about">🔒 {t("premium_only_registered")}</p>
              <motion.button
                className="pq-btn-primary"
                whileTap={{ scale: 0.96 }}
                transition={spring.snappy}
                onClick={() => {
                  haptic(10);
                  navigate("/login", { state: { mode: "register" } });
                }}
              >
                {t("create_account")}
              </motion.button>
            </>
          ) : (
            <motion.button
              className="pq-btn-primary"
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              disabled={busy}
              onClick={buy}
            >
              {busy ? t("activating") : t("premium_cta")}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
