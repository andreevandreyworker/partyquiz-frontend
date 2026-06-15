import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { errKey } from "../errors";
import type { Category } from "../types";

export default function CategoriesScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get("mode") === "solo" ? "solo" : "multi";

  const [cats, setCats] = useState<Category[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.categories().then(setCats).catch(() => setError(t("err_generic")));
  }, [t]);

  const finish = async (selected: string[]) => {
    setBusy(true);
    setError("");
    try {
      const room = await api.createRoom(mode, selected);
      navigate(`/room/${room.code}`, { replace: true });
    } catch (e) {
      setError(t(errKey((e as Error).message)));
      setBusy(false);
    }
  };

  const decide = (keep: boolean) => {
    const cat = cats[index];
    const selected = keep ? [...picked, cat.id] : picked;
    setPicked(selected);
    if (index + 1 >= cats.length) {
      finish(selected.length ? selected : ["random"]);
    } else {
      setIndex(index + 1);
    }
  };

  if (!cats.length) {
    return (
      <div className="screen">
        <div className="spacer" />
        <div className="meta" style={{ textAlign: "center" }}>
          {error || "…"}
        </div>
        <div className="spacer" />
      </div>
    );
  }

  const cat = cats[index];
  const label = i18n.language === "ru" ? cat.ru : cat.en;

  return (
    <div className="screen">
      <div className="topbar">
        <button
          className="ghost langtoggle"
          onClick={() => navigate("/")}
        >
          {t("back")}
        </button>
        <div className="meta">
          {index + 1}/{cats.length}
        </div>
      </div>
      <div className="title">{t("pick_categories")}</div>
      <div className="meta">{t("swipe_hint")}</div>
      <div className="spacer" />
      <div className="swipe-card">{label}</div>
      <div className="spacer" />
      {error && <div className="error">{error}</div>}
      <div className="row">
        <button
          className="secondary"
          disabled={busy}
          onClick={() => decide(false)}
        >
          {t("skip")}
        </button>
        <button disabled={busy} onClick={() => decide(true)}>
          {t("norm")}
        </button>
      </div>
    </div>
  );
}
