import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { api } from "../api";
import { errKey } from "../errors";
import { spring, haptic } from "../motion";

interface Props {
  code: string;
  onClose: () => void;
  onSent: () => void;
}

export default function StatementComposer({
  code,
  onClose,
  onSent,
}: Props) {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);

  const askAI = async () => {
    setAiBusy(true);
    setError("");
    haptic(8);
    try {
      const res = await api.suggest(text.trim(), i18n.language);
      setText(res.question);
      haptic([6, 20, 6]);
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setAiBusy(false);
    }
  };

  const send = async () => {
    setBusy(true);
    setError("");
    haptic(10);
    try {
      await api.submitStatement(code, text.trim());
      onSent();
    } catch (e) {
      setError(t(errKey((e as Error).message)));
      setBusy(false);
    }
  };

  return (
    <motion.div
      className="pq-sheet-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="pq-compose"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={spring.snappy}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pq-compose-grip" />
        <div className="pq-compose-title">{t("your_statement")}</div>
        <textarea
          className="pq-textarea"
          rows={3}
          value={text}
          maxLength={512}
          placeholder={t("statement_ph")}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <div className="pq-err">{error}</div>}
        <motion.button
          className={`pq-ai-btn ${aiBusy ? "thinking" : ""}`}
          whileTap={{ scale: 0.96 }}
          transition={spring.snappy}
          disabled={aiBusy || busy}
          onClick={askAI}
        >
          {aiBusy ? (
            <span className="pq-ai-thinking">
              <motion.span
                className="pq-ai-spark"
                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.25, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                ✨
              </motion.span>
              {t("ai_thinking")}
              <span className="pq-ai-dots">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.18,
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </span>
            </span>
          ) : (
            `✨ ${t("ai_help")}`
          )}
        </motion.button>
        <motion.button
          className="pq-btn-primary"
          whileTap={{ scale: 0.96 }}
          transition={spring.snappy}
          disabled={busy || !text.trim()}
          onClick={send}
        >
          {t("send")}
        </motion.button>
        <button className="pq-btn-text" onClick={onClose}>
          {t("cancel")}
        </button>
      </motion.div>
    </motion.div>
  );
}
