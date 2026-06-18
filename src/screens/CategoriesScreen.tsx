import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { api } from "../api";
import { useAuth } from "../auth";
import { errKey } from "../errors";
import { loadCategoryAssets, assetUrl, type CategoryAsset } from "../cms";
import { spring, haptic, burstFrom } from "../motion";
import LoadingScreen from "../components/LoadingScreen";
import type { Category } from "../types";

function CategoryArt({
  icon,
  videoId,
}: {
  icon: string | null | undefined;
  videoId: string | null;
}) {
  const src = assetUrl(videoId);
  if (src) {
    return (
      <video
        className="pq-cat-video"
        src={src}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }
  return <span className="pq-cat-emoji">{icon ?? "🎲"}</span>;
}

function ThumbUp() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm3 0 3.5-6.5a1.8 1.8 0 0 1 3.3 1.3L16 8h4.2a1.8 1.8 0 0 1 1.76 2.2l-1.6 7A1.8 1.8 0 0 1 18.6 19H10v-9Z"
        fill="#fff"
      />
    </svg>
  );
}

function ThumbDown() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M17 14V5h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-3Zm-3 0-3.5 6.5a1.8 1.8 0 0 1-3.3-1.3L8 16H3.8A1.8 1.8 0 0 1 2.04 13.8l1.6-7A1.8 1.8 0 0 1 5.4 5H14v9Z"
        fill="var(--pq-accent-red)"
      />
    </svg>
  );
}

export default function CategoriesScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const [params] = useSearchParams();
  const mode = params.get("mode") === "solo" ? "solo" : "multi";

  const [cats, setCats] = useState<Category[]>([]);
  const [assets, setAssets] = useState<Record<number, CategoryAsset>>({});
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [animating, setAnimating] = useState(false);
  const keepBtn = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-20, 20]);
  const keepOp = useTransform(x, [30, 130], [0, 1]);
  const skipOp = useTransform(x, [-130, -30], [1, 0]);
  const artTilt = useTransform(x, [-240, 240], [-10, 10]);

  const cardVariants = {
    enter: { scale: 0.94, y: 14, opacity: 1 },
    center: { scale: 1, y: 0, opacity: 1 },
  };

  useEffect(() => {
    api.categories().then(setCats).catch(() => setError(t("err_generic")));
    loadCategoryAssets().then(setAssets);
  }, [t]);

  const finish = async (selected: number[]) => {
    setCreating(true);
    setError("");
    try {
      const room = await api.createRoom(mode, selected);
      navigate(`/room/${room.code}`, { replace: true });
    } catch (e) {
      setError(t(errKey((e as Error).message)));
      setCreating(false);
    }
  };

  const commit = (keep: boolean) => {
    if (animating || creating) return;
    const cat = cats[index];
    if (keep && cat.premium && !isPremium) return;
    const selected = keep ? [...picked, cat.id] : picked;
    setAnimating(true);
    if (keep) {
      haptic([10, 30, 10]);
      burstFrom(keepBtn.current);
    } else {
      haptic(12);
    }
    const target = keep ? 600 : -600;
    animate(x, target, {
      duration: 0.34,
      ease: [0.32, 0, 0.67, 0],
    }).then(() => {
      setPicked(selected);
      x.set(0);
      setAnimating(false);
      if (index + 1 >= cats.length) {
        finish(selected);
      } else {
        setIndex(index + 1);
      }
    });
  };

  if (creating) return <LoadingScreen />;

  if (!cats.length) {
    return (
      <div className="screen pq-cats">
        <div className="pq-cats-empty">{error || "…"}</div>
      </div>
    );
  }

  const cat = cats[index];
  const label = i18n.language === "ru" ? cat.ru : cat.en;
  const locked = cat.premium && !isPremium;
  const nextCat = cats[index + 1];
  const nextLabel = nextCat
    ? i18n.language === "ru"
      ? nextCat.ru
      : nextCat.en
    : "";

  return (
    <div className="screen pq-cats">
      <div className="pq-cats-head">
        <motion.button
          className="pq-close"
          whileTap={{ scale: 0.88 }}
          transition={spring.snappy}
          onClick={() => {
            haptic(8);
            navigate("/");
          }}
        >
          ✕
        </motion.button>
        <div className="pq-cats-counter">
          {index + 1} / {cats.length}
        </div>
      </div>

      <motion.div
        className="pq-cats-title"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.gentle}
      >
        {t("adding_category")}{" "}
        <span className="pq-coral">{t("adding_category_q")}</span>
      </motion.div>

      <div className="pq-deck">
        {nextCat && (
          <motion.div
            className="pq-cat-card behind"
            key={`behind-${nextCat.id}`}
            initial={{ scale: 0.9, y: -14, opacity: 0.5 }}
            animate={{ scale: 0.94, y: -20, opacity: 0.9 }}
            transition={spring.gentle}
          >
            <div className="pq-cat-art">
              <CategoryArt
                icon={nextCat.icon}
                videoId={nextCat.video ?? null}
              />
            </div>
            <div className="pq-cat-name">{nextLabel}</div>
          </motion.div>
        )}

        <motion.div
          key={cat.id}
          className={`pq-cat-card ${locked ? "locked" : ""}`}
          style={{ x, rotate }}
          drag={locked || animating ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          variants={cardVariants}
          initial="enter"
          animate="center"
          transition={spring.bouncy}
          onDragEnd={(_, info) => {
            const power = info.offset.x + info.velocity.x * 0.25;
            if (power > 130 && !locked) commit(true);
            else if (power < -130) commit(false);
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          <motion.div className="pq-stamp keep" style={{ opacity: keepOp }}>
            {t("logo_top")}
          </motion.div>
          <motion.div className="pq-stamp skip" style={{ opacity: skipOp }}>
            {t("logo_bottom")}
          </motion.div>

          <motion.div className="pq-cat-art" style={{ rotate: artTilt }}>
            <CategoryArt
              icon={cat.icon}
              videoId={cat.video ?? null}
            />
          </motion.div>
          <div className="pq-cat-name">{label}</div>
          {assets[cat.id]?.picked_pct != null && (
            <div className="pq-cat-stat">
              🔥 {t("picked_stat", { pct: assets[cat.id].picked_pct })}
            </div>
          )}
          {locked && (
            <div className="pq-cat-lock">🔒 {t("premium_locked")}</div>
          )}
        </motion.div>
      </div>

      <div className="pq-deck-actions">
        <motion.button
          className="pq-round skip"
          whileTap={{ scale: 0.82 }}
          transition={spring.pop}
          onClick={() => commit(false)}
        >
          <ThumbDown />
        </motion.button>
        <motion.button
          ref={keepBtn}
          className="pq-round keep"
          whileTap={{ scale: 0.82 }}
          transition={spring.pop}
          disabled={locked}
          onClick={() => commit(true)}
        >
          <ThumbUp />
        </motion.button>
      </div>

      <div className="pq-cats-dots">
        {cats.map((c, i) => (
          <span
            key={c.id}
            className={`pq-cdot ${
              i < index ? "done" : i === index ? "now" : ""
            }`}
          />
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
