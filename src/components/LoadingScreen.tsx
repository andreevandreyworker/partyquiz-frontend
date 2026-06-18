import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { spring } from "../motion";
import Mascot from "./Mascot";

const R = 78;
const C = 2 * Math.PI * R;

export default function LoadingScreen() {
  const { t } = useTranslation();

  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 90, damping: 20 });
  const pctText = useTransform(smooth, (v) => `${Math.round(v)}%`);
  const offset = useTransform(smooth, (v) => C - (v / 100) * C);

  useEffect(() => {
    const controls = animate(raw, 94, {
      duration: 2.4,
      ease: [0.22, 0.7, 0.3, 1],
    });
    return () => controls.stop();
  }, [raw]);

  return (
    <div className="screen pq-loading">
      <motion.div
        className="pq-load-head"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.gentle}
      >
        <div className="pq-load-title">{t("loading_title")}</div>
        <div className="pq-load-sub">{t("loading_sub")}</div>
      </motion.div>

      <motion.div
        className="pq-ring-wrap"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring.bouncy}
      >
        <svg className="pq-ring" width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="var(--pq-paw)"
            strokeWidth="12"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="var(--pq-accent-green)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={C}
            style={{ strokeDashoffset: offset }}
            transform="rotate(-90 100 100)"
          />
        </svg>
        <motion.div
          className="pq-ring-cat"
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mascot size={120} />
        </motion.div>
        <motion.div
          className="pq-heart-bubble"
          animate={{ scale: [1, 1.22, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          ❤
        </motion.div>
        <motion.div className="pq-ring-pct">{pctText}</motion.div>
      </motion.div>

      <motion.div
        className="pq-tip-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.2 }}
      >
        <span className="pq-tip-bulb">💡</span>
        <span className="pq-tip-text">{t("loading_tip")}</span>
      </motion.div>
    </div>
  );
}
