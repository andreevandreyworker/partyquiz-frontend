import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { api } from "../api";
import { useAuth } from "../auth";
import { errKey } from "../errors";
import type { Choice, Room } from "../types";
import { openRoomSocket } from "../ws";
import { spring, haptic, burstFrom, bigCelebrate } from "../motion";
import StatementComposer from "../components/StatementComposer";

const SWIPE_THRESHOLD = 110;
const REVEAL_SECONDS = 5;

function initials(login: string): string {
  const parts = login.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return login.trim().slice(0, 2).toUpperCase();
}

function Bar({ value, total, kind, label }: {
  value: number;
  total: number;
  kind: "norm" | "cringe";
  label: string;
}) {
  const pct = total ? (value / total) * 100 : 0;
  const mv = useSpring(0, { stiffness: 120, damping: 22 });
  const num = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return (
    <div className="pq-reveal-row">
      <span>
        {kind === "norm" ? "👍" : "👎"} {label}
      </span>
      <div className="pq-bar-track">
        <motion.div
          className={`pq-bar-fill ${kind}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ ...spring.gentle, delay: 0.15 }}
        />
      </div>
      <motion.b>{num}</motion.b>
    </div>
  );
}

export default function RoomScreen() {
  const { t } = useTranslation();
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [fired, setFired] = useState<Record<string, boolean>>({});
  const [composing, setComposing] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [voteBusy, setVoteBusy] = useState(false);
  const [hostBusy, setHostBusy] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const fireBtn = useRef<HTMLButtonElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const celebrated = useRef<string>("");

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-18, 18]);
  const normOp = useTransform(x, [30, 130], [0, 1]);
  const cringeOp = useTransform(x, [-130, -30], [1, 0]);

  const refresh = async () => {
    try {
      setRoom(await api.getRoom(code));
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => {
    refresh();
    const ws = openRoomSocket(code, (ev) => {
      if (ev.type === "statement_shown") {
        refresh();
        setToast("");
      } else if (ev.type === "revealed") {
        refresh();
      } else if (ev.type === "vote_progress") {
        setRoom((r) => (r ? { ...r, voted_count: ev.voted_count } : r));
      } else if (ev.type === "fire_update") {
        setRoom((r) =>
          r && r.current_question?.id === ev.question_id
            ? {
                ...r,
                current_question: {
                  ...r.current_question,
                  fire_count: ev.fire_count,
                },
              }
            : r,
        );
      } else if (ev.type === "player_joined") {
        showToast(`+ ${ev.login}`);
        haptic(10);
        refresh();
      } else if (ev.type === "player_left") {
        refresh();
      } else if (ev.type === "host_changed") {
        showToast(`${t("host")}: ${ev.login}`);
        refresh();
      } else if (ev.type === "statement_queued") {
        showToast(`${t("in_queue")}: ${ev.author_login}`);
        refresh();
      }
    });
    wsRef.current = ws;
    return () => ws.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const advance = async () => {
    setHostBusy(true);
    setError("");
    try {
      setRoom(await api.advance(code));
      setFired({});
      x.set(0);
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setHostBusy(false);
    }
  };

  const reveal = async () => {
    setHostBusy(true);
    setError("");
    try {
      setRoom(await api.reveal(code));
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setHostBusy(false);
    }
  };

  const vote = async (choice: Choice) => {
    if (voteBusy || room?.my_vote) return;
    setVoteBusy(true);
    setError("");
    haptic(choice === "norm" ? [10, 30, 10] : 14);
    try {
      setRoom(await api.vote(code, choice));
    } catch (e) {
      setError(t(errKey((e as Error).message)));
    } finally {
      setVoteBusy(false);
    }
  };

  const fire = async () => {
    const q = room?.current_question;
    if (!q) return;
    const on = !fired[q.id];
    setFired((f) => ({ ...f, [q.id]: on }));
    if (on) {
      haptic(12);
      burstFrom(fireBtn.current);
    }
    try {
      await api.fire(code, q.id);
    } catch {
      setFired((f) => ({ ...f, [q.id]: !on }));
    }
  };

  const leave = async () => {
    try {
      await api.leave(code);
    } catch {
      /* ignore */
    }
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (room?.phase !== "revealed") {
      setCountdown(0);
      return;
    }
    if (room.current_question && celebrated.current !== room.current_question.id) {
      celebrated.current = room.current_question.id;
      bigCelebrate();
      haptic([10, 40, 10]);
    }
    setCountdown(REVEAL_SECONDS);
    let remaining = REVEAL_SECONDS;
    const id = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining > 0 ? remaining : 0);
      if (remaining <= 0) {
        clearInterval(id);
        if (room?.host_user_id === userId) advance();
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.phase, room?.current_question?.id, room?.host_user_id]);

  const onDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const power = info.offset.x + info.velocity.x * 0.25;
    if (power > SWIPE_THRESHOLD) vote("norm");
    else if (power < -SWIPE_THRESHOLD) vote("cringe");
  };

  if (!room) {
    return (
      <div className="screen pq-room">
        <div className="pq-room-loading">{error || "…"}</div>
      </div>
    );
  }

  const isHost = room.host_user_id === userId;
  const q = room.current_question;
  const phase = room.phase;
  const total = room.players.length;
  const pct = total ? (room.voted_count / total) * 100 : 0;
  const tally = room.tally;
  const tallyTotal = tally ? tally.norm + tally.cringe : 0;
  const srcLabel =
    q?.source === "user" && q.author_login
      ? `${t("by")} ${q.author_login}`
      : q?.source === "ai"
        ? t("from_ai")
        : t("from_bank");

  return (
    <div className="screen pq-room">
      <div className="pq-room-head">
        <motion.span
          className="pq-code-pill"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={spring.bouncy}
        >
          {room.code}
        </motion.span>
        <div className="pq-avatars">
          <AnimatePresence>
            {room.players.slice(0, 6).map((p) => (
              <motion.div
                key={p.user_id}
                className={`pq-avatar ${p.is_host ? "host" : ""}`}
                title={p.login}
                initial={{ scale: 0, x: -10 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={spring.bouncy}
              >
                {initials(p.login)}
              </motion.div>
            ))}
          </AnimatePresence>
          {total > 6 && <div className="pq-avatar more">+{total - 6}</div>}
        </div>
        <div className="pq-room-actions">
          {phase !== "lobby" && (
            <motion.button
              className="pq-icon-btn"
              whileTap={{ scale: 0.85 }}
              transition={spring.snappy}
              onClick={() => {
                haptic(8);
                setComposing(true);
              }}
              aria-label={t("add_statement")}
            >
              ＋
            </motion.button>
          )}
          <motion.button
            className="pq-icon-btn"
            whileTap={{ scale: 0.85 }}
            transition={spring.snappy}
            onClick={leave}
            aria-label={t("leave")}
          >
            ✕
          </motion.button>
        </div>
      </div>

      <div className="pq-room-body">
        {phase === "lobby" && (
          <motion.div
            className="pq-lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring.gentle}
          >
            <div className="pq-lobby-title">{t("lobby_title")}</div>
            <motion.div
              className="pq-lobby-code"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              {room.code}
            </motion.div>
            <div className="pq-lobby-share">{t("lobby_share")}</div>
            <div className="pq-lobby-players">
              {t("players_n", { n: total })}
            </div>
          </motion.div>
        )}

        {q && phase === "voting" && (
          <motion.div
            key={q.id}
            className={`pq-vote-card ${room.my_vote ? "voted" : ""}`}
            style={{ x, rotate }}
            drag={room.my_vote ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            initial={{ scale: 0.92, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={spring.bouncy}
            onDragEnd={onDragEnd}
          >
            <motion.div className="pq-stamp keep" style={{ opacity: normOp }}>
              {t("logo_top")}
            </motion.div>
            <motion.div className="pq-stamp skip" style={{ opacity: cringeOp }}>
              {t("logo_bottom")}
            </motion.div>
            <span className="pq-src-chip">{srcLabel}</span>
            <div className="pq-vote-text">{q.text}</div>
            <motion.button
              ref={fireBtn}
              className={`pq-fire ${fired[q.id] ? "on" : ""}`}
              whileTap={{ scale: 0.85 }}
              transition={spring.pop}
              onClick={fire}
            >
              🔥 {q.fire_count}
            </motion.button>
          </motion.div>
        )}

        {q && phase === "revealed" && (
          <motion.div
            className="pq-vote-card reveal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={spring.bouncy}
          >
            <span className="pq-src-chip">{srcLabel}</span>
            <div className="pq-vote-text">{q.text}</div>
            {tally && (
              <div className="pq-reveal-bars">
                <Bar
                  value={tally.norm}
                  total={tallyTotal}
                  kind="norm"
                  label={t("result_norm")}
                />
                <Bar
                  value={tally.cringe}
                  total={tallyTotal}
                  kind="cringe"
                  label={t("result_cringe")}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="pq-room-footer">
        {error && <div className="pq-err">{error}</div>}

        {phase === "voting" && (
          <>
            <div className="pq-progress">
              <motion.div
                className="pq-progress-bar"
                animate={{ width: `${pct}%` }}
                transition={spring.gentle}
              />
            </div>
            <div className="pq-progress-label">
              {room.voted_count}/{total} {t("voted_n")}
            </div>
            <div className="pq-vote-actions">
              <motion.button
                className={`pq-vote-btn skip ${
                  room.my_vote === "cringe" ? "picked" : ""
                } ${room.my_vote ? "locked" : ""}`}
                whileTap={room.my_vote ? undefined : { scale: 0.94 }}
                transition={spring.pop}
                disabled={voteBusy || !!room.my_vote}
                onClick={() => vote("cringe")}
              >
                <span className="pq-vote-emoji">👎</span>
                <span className="pq-vote-word">{t("logo_bottom")}</span>
              </motion.button>
              <motion.button
                className={`pq-vote-btn keep ${
                  room.my_vote === "norm" ? "picked" : ""
                } ${room.my_vote ? "locked" : ""}`}
                whileTap={room.my_vote ? undefined : { scale: 0.94 }}
                transition={spring.pop}
                disabled={voteBusy || !!room.my_vote}
                onClick={() => vote("norm")}
              >
                <span className="pq-vote-emoji">👍</span>
                <span className="pq-vote-word">{t("logo_top")}</span>
              </motion.button>
            </div>
            {isHost && (
              <motion.button
                className="pq-btn-light"
                whileTap={{ scale: 0.96 }}
                transition={spring.snappy}
                disabled={hostBusy}
                onClick={reveal}
              >
                {t("reveal")} · {room.voted_count}/{total}
              </motion.button>
            )}
          </>
        )}

        {phase === "lobby" &&
          (isHost ? (
            <motion.button
              className="pq-btn-primary"
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              disabled={hostBusy}
              onClick={advance}
            >
              {t("begin_round")}
            </motion.button>
          ) : (
            <div className="pq-waiting">{t("waiting_host")}</div>
          ))}

        {phase === "revealed" && (
          <>
            <div className="pq-countdown">
              {t("next_in", { n: countdown })}
            </div>
            {isHost && (
              <motion.button
                className="pq-btn-primary"
                whileTap={{ scale: 0.96 }}
                transition={spring.snappy}
                disabled={hostBusy}
                onClick={advance}
              >
                {t("next_now")}
              </motion.button>
            )}
          </>
        )}

        {phase === "voting" && !isHost && room.my_vote && (
          <div className="pq-waiting">{t("waiting_votes")}</div>
        )}
      </div>

      <AnimatePresence>
        {composing && (
          <StatementComposer
            code={code}
            onClose={() => setComposing(false)}
            onSent={() => {
              setComposing(false);
              refresh();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="pq-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={spring.bouncy}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
