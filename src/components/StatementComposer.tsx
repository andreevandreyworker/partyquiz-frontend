import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import { errKey } from "../errors";

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
    try {
      const res = await api.suggest(text.trim(), i18n.language);
      setText(res.question);
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setAiBusy(false);
    }
  };

  const send = async () => {
    setBusy(true);
    setError("");
    try {
      await api.submitStatement(code, text.trim());
      onSent();
    } catch (e) {
      setError(t(errKey((e as Error).message)));
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          borderRadius: "20px 20px 0 0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="title"
          style={{ fontSize: 20, marginBottom: 12 }}
        >
          {t("your_statement")}
        </div>
        <textarea
          rows={3}
          value={text}
          maxLength={512}
          placeholder={t("statement_ph")}
          onChange={(e) => setText(e.target.value)}
        />
        {error && (
          <div className="error" style={{ marginTop: 10 }}>
            {error}
          </div>
        )}
        <div className="row" style={{ marginTop: 12 }}>
          <button
            className="secondary"
            disabled={aiBusy || busy}
            onClick={askAI}
          >
            {aiBusy ? t("ai_thinking") : `✨ ${t("ai_help")}`}
          </button>
          <button disabled={busy || !text.trim()} onClick={send}>
            {t("send")}
          </button>
        </div>
        <button
          className="ghost"
          style={{ marginTop: 10 }}
          onClick={onClose}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
