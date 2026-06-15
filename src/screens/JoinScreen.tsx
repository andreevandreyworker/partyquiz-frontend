import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { errKey } from "../errors";

export default function JoinScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const join = async () => {
    setBusy(true);
    setError("");
    try {
      const room = await api.joinRoom(code.trim().toUpperCase());
      navigate(`/room/${room.code}`, { replace: true });
    } catch (e) {
      setError(t(errKey((e as Error).message)));
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      <div className="topbar">
        <button
          className="ghost langtoggle"
          onClick={() => navigate("/")}
        >
          {t("back")}
        </button>
      </div>
      <div className="spacer" />
      <div className="title">{t("enter_code")}</div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ABCDE"
        maxLength={8}
        autoCapitalize="characters"
        style={{ textAlign: "center", fontSize: 24, letterSpacing: 4 }}
      />
      {error && <div className="error">{error}</div>}
      <button disabled={busy || code.length < 4} onClick={join}>
        {t("connect")}
      </button>
      <div className="spacer" />
    </div>
  );
}
