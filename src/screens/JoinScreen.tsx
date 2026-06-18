import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { errKey } from "../errors";
import { spring, container, item, haptic } from "../motion";

export default function JoinScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const join = async () => {
    setBusy(true);
    setError("");
    haptic(10);
    try {
      const room = await api.joinRoom(code.trim().toUpperCase());
      navigate(`/room/${room.code}`, { replace: true });
    } catch (e) {
      setError(t(errKey((e as Error).message)));
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
            navigate("/");
          }}
        >
          ‹ {t("back")}
        </motion.button>
      </motion.div>

      <motion.div
        className="pq-join-hero"
        variants={item}
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🔑
      </motion.div>

      <motion.div className="pq-auth-card" variants={item}>
        <div className="pq-auth-title">{t("enter_code")}</div>
        <input
          className="pq-input pq-code-input"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ABCDE"
          maxLength={8}
          autoCapitalize="characters"
        />
        {error && <div className="pq-err">{error}</div>}
        <motion.button
          className="pq-btn-primary"
          whileTap={{ scale: 0.96 }}
          transition={spring.snappy}
          disabled={busy || code.length < 4}
          onClick={join}
        >
          {t("connect")}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
