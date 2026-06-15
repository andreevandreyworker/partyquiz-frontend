import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import { errKey } from "../errors";
import type { Choice, Room } from "../types";
import { openRoomSocket } from "../ws";
import StatementComposer from "../components/StatementComposer";

const SWIPE_THRESHOLD = 90;
const REVEAL_SECONDS = 1;

function initials(login: string): string {
  const parts = login.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return login.trim().slice(0, 2).toUpperCase();
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
  const [drag, setDrag] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const dragStart = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

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
        setRoom((r) =>
          r ? { ...r, voted_count: ev.voted_count } : r,
        );
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
    setVoteBusy(true);
    setError("");
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
    setFired((f) => ({ ...f, [q.id]: !f[q.id] }));
    try {
      await api.fire(code, q.id);
    } catch {
      setFired((f) => ({ ...f, [q.id]: !f[q.id] }));
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

  const onDown = (e: React.PointerEvent) => {
    if (voteBusy) return;
    dragStart.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    setDrag(e.clientX - dragStart.current);
  };

  const onUp = () => {
    if (dragStart.current === null) return;
    const d = drag;
    dragStart.current = null;
    setDrag(0);
    if (d > SWIPE_THRESHOLD) vote("norm");
    else if (d < -SWIPE_THRESHOLD) vote("cringe");
  };

  if (!room) {
    return (
      <div className="game">
        <div className="game-hero">
          <div className="meta">{error || "…"}</div>
        </div>
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
  const swipeHint =
    drag > 30 ? "norm" : drag < -30 ? "cringe" : null;

  return (
    <div className="game">
      <div className="game-header">
        <span className="badge code-pill">{room.code}</span>
        <div className="avatars">
          {room.players.slice(0, 6).map((p) => (
            <div
              key={p.user_id}
              className={`avatar ${p.is_host ? "host" : ""}`}
              title={p.login}
            >
              {initials(p.login)}
            </div>
          ))}
          {total > 6 && <div className="avatar more">+{total - 6}</div>}
        </div>
        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={() => setComposing(true)}
            aria-label={t("add_statement")}
          >
            ＋
          </button>
          <button
            className="icon-btn"
            onClick={leave}
            aria-label={t("leave")}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="game-hero">
        {phase === "lobby" && (
          <div className="lobby-block">
            <div className="code">{room.code}</div>
            <div className="meta">{t("share_code")}</div>
          </div>
        )}

        {q && phase === "voting" && (
          <div
            className={`vote-card ${swipeHint ?? ""}`}
            style={{
              transform: `translateX(${drag}px) rotate(${drag / 22}deg)`,
              transition: dragStart.current === null
                ? "transform 0.25s ease"
                : "none",
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <span className="src-chip">
              {q.source === "user" && q.author_login
                ? `${t("by")} ${q.author_login}`
                : q.source === "ai"
                  ? t("from_ai")
                  : t("from_bank")}
            </span>
            <div className="vote-statement">{q.text}</div>
            <button
              className={`fire-mini ${fired[q.id] ? "on" : ""}`}
              onClick={fire}
            >
              🔥 {q.fire_count}
            </button>
            <span className="swipe-tag cringe-tag">👎</span>
            <span className="swipe-tag norm-tag">👍</span>
          </div>
        )}

        {q && phase === "revealed" && (
          <div className="vote-card reveal">
            <span className="src-chip">
              {q.source === "user" && q.author_login
                ? `${t("by")} ${q.author_login}`
                : q.source === "ai"
                  ? t("from_ai")
                  : t("from_bank")}
            </span>
            <div className="vote-statement">{q.text}</div>
            {tally && (
              <div className="reveal-bars">
                <div className="reveal-row">
                  <span>👍 {t("result_norm")}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill norm"
                      style={{
                        width: `${
                          tallyTotal
                            ? (tally.norm / tallyTotal) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <b>{tally.norm}</b>
                </div>
                <div className="reveal-row">
                  <span>👎 {t("result_cringe")}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill cringe"
                      style={{
                        width: `${
                          tallyTotal
                            ? (tally.cringe / tallyTotal) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <b>{tally.cringe}</b>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="game-footer">
        {error && <div className="error">{error}</div>}

        {phase === "voting" && (
          <>
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="progress-label">
              {room.voted_count}/{total} {t("voted_n")}
            </div>
            <div className="vote-actions">
              <button
                className={`vote-btn cringe ${
                  room.my_vote === "cringe" ? "picked" : ""
                }`}
                disabled={voteBusy}
                onClick={() => vote("cringe")}
              >
                {t("vote_cringe")}
              </button>
              <button
                className={`vote-btn norm ${
                  room.my_vote === "norm" ? "picked" : ""
                }`}
                disabled={voteBusy}
                onClick={() => vote("norm")}
              >
                {t("vote_norm")}
              </button>
            </div>
            {isHost && (
              <button
                className="host-bar"
                disabled={hostBusy}
                onClick={reveal}
              >
                {t("reveal")} · {room.voted_count}/{total}
              </button>
            )}
          </>
        )}

        {phase === "lobby" &&
          (isHost ? (
            <button
              className="primary-action"
              disabled={hostBusy}
              onClick={advance}
            >
              {t("begin_round")}
            </button>
          ) : (
            <div className="waiting">{t("waiting_host")}</div>
          ))}

        {phase === "revealed" && (
          <>
            <div className="countdown-label">
              {t("next_in", { n: countdown })}
            </div>
            {isHost && (
              <button
                className="primary-action"
                disabled={hostBusy}
                onClick={advance}
              >
                {t("next_now")}
              </button>
            )}
          </>
        )}

        {phase === "voting" && !isHost && room.my_vote && (
          <div className="waiting">{t("waiting_votes")}</div>
        )}
      </div>

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

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
