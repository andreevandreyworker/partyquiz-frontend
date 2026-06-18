import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth";
import { spring, container, item, haptic } from "../motion";

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
  const { login, isPremium, isGuest } = useAuth();

  const name = isGuest ? t("guest_label") : login ?? "";

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

      <motion.div className="pq-profile-head" variants={item}>
        <div className={`pq-avatar-lg ${isPremium ? "premium" : ""}`}>
          {initials(name)}
        </div>
        <div className="pq-profile-name">{name}</div>
        <div className={`pq-plan-pill ${isPremium ? "premium" : ""}`}>
          {isPremium ? t("premium_plan") : t("free_plan")}
        </div>
      </motion.div>

      {isPremium ? (
        <motion.div className="pq-auth-card" variants={item}>
          <div className="pq-auth-title">{t("premium_active")}</div>
          <ul className="pq-perks">
            <li>✓ {t("premium_perk_hot")}</li>
            <li>✓ {t("premium_perk_ai")}</li>
            <li>✓ {t("premium_perk_codes")}</li>
          </ul>
        </motion.div>
      ) : (
        <motion.div className="pq-auth-card" variants={item}>
          <div className="pq-auth-title">{t("premium_title")}</div>
          <ul className="pq-perks">
            <li>🔓 {t("premium_perk_hot")}</li>
            <li>🤖 {t("premium_perk_ai")}</li>
            <li>🎲 {t("premium_perk_codes")}</li>
          </ul>
          {isGuest ? (
            <>
              <p className="pq-about">{t("account_required")}</p>
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
              onClick={() => {
                haptic(10);
                navigate("/premium");
              }}
            >
              {t("go_premium")}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
