import { useCallback, useEffect, useRef, useState } from "react";
import { studio, type Step, type Task } from "./studio-api";

const SCREENS = [
  "onboarding", "login", "home", "categories", "join", "loading",
  "room-lobby", "room-vote", "room-reveal", "profile", "premium", "settings",
];

const GALLERY = "/gallery.html";

function Composer({ onCreated }: { onCreated: () => void }) {
  const [screen, setScreen] = useState("home");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  const addFiles = useCallback((list: FileList | File[]) => {
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (imgs.length) setFiles((prev) => [...prev, ...imgs]);
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imgs: File[] = [];
      for (const it of items) {
        if (it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) imgs.push(f);
        }
      }
      if (imgs.length) addFiles(imgs);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  const submit = async () => {
    if (!prompt.trim()) return;
    setBusy(true);
    setErr("");
    try {
      const task = await studio.createTask(screen, prompt.trim());
      for (const f of files) await studio.uploadImage(task.id, f);
      setPrompt("");
      setFiles([]);
      onCreated();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="st-composer">
      <div className="st-row">
        <label className="st-lbl">Экран</label>
        <select
          className="st-select"
          value={screen}
          onChange={(e) => setScreen(e.target.value)}
        >
          {SCREENS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div
        ref={dropRef}
        className="st-drop"
        onDragOver={(e) => {
          e.preventDefault();
          dropRef.current?.classList.add("over");
        }}
        onDragLeave={() => dropRef.current?.classList.remove("over")}
        onDrop={(e) => {
          e.preventDefault();
          dropRef.current?.classList.remove("over");
          addFiles(e.dataTransfer.files);
        }}
      >
        <textarea
          className="st-textarea"
          rows={5}
          value={prompt}
          placeholder="Сделай этот экран точь-в-точь как на картинке. Опиши правки, анимацию…"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="st-drop-hint">
          Перетащи / вставь (Ctrl+V) картинки сюда или
          <label className="st-file-btn">
            выбери файл
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="st-thumbs">
          {files.map((f, i) => (
            <div className="st-thumb" key={i}>
              <img src={URL.createObjectURL(f)} alt="ref" />
              <button
                className="st-thumb-x"
                onClick={() =>
                  setFiles((prev) => prev.filter((_, j) => j !== i))
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {err && <div className="st-err">{err}</div>}

      <button className="st-send" disabled={busy || !prompt.trim()} onClick={submit}>
        {busy ? "Отправляю…" : "Отправить задачу"}
      </button>
    </div>
  );
}

function StepRow({ step }: { step: Step }) {
  const time = new Date(step.created_at).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <div className={`st-step ${step.kind}`}>
      <span className="st-step-dot" />
      <div className="st-step-body">
        <div className="st-step-text">{step.text}</div>
        <div className="st-step-time">{time}</div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const done = task.status === "done";
  const working = task.status === "working";
  const label = done ? "готово" : working ? "в работе" : "в очереди";
  return (
    <div className={`st-task ${task.status}`}>
      <div className="st-task-head">
        <span className="st-chip">{task.screen_id}</span>
        <span className={`st-status ${task.status}`}>
          {working && <span className="st-pulse" />}
          {label}
        </span>
      </div>
      <div className="st-task-prompt">{task.prompt}</div>

      <div className="st-ba">
        {task.images.length > 0 && (
          <div className="st-ba-col">
            <div className="st-ba-lbl">Референс</div>
            <div className="st-ba-imgs">
              {task.images.map((n) => (
                <a key={n} href={studio.uploadUrl(n)} target="_blank" rel="noreferrer">
                  <img src={studio.uploadUrl(n)} alt="ref" />
                </a>
              ))}
            </div>
          </div>
        )}
        {task.result_image && (
          <div className="st-ba-col">
            <div className="st-ba-lbl">Результат</div>
            <div className="st-ba-imgs">
              <a href={studio.resultUrl(task.result_image)} target="_blank" rel="noreferrer">
                <img src={studio.resultUrl(task.result_image)} alt="result" />
              </a>
            </div>
          </div>
        )}
      </div>

      {task.steps.length > 0 && (
        <div className="st-timeline">
          <div className="st-timeline-lbl">
            Процесс
            {working && <span className="st-live">live</span>}
          </div>
          {task.steps.map((s, i) => (
            <StepRow key={i} step={s} />
          ))}
          {working && (
            <div className="st-step working-now">
              <span className="st-step-dot" />
              <div className="st-step-body">
                <div className="st-step-text st-working-text">
                  работаю…
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {task.reply && <div className="st-reply">{task.reply}</div>}
    </div>
  );
}

function LoginGate({ onOk }: { onOk: () => void }) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await studio.login(password);
      onOk();
    } catch {
      setErr("Неверный пароль");
      setBusy(false);
    }
  };

  return (
    <div className="st-login">
      <form className="st-login-card" onSubmit={submit}>
        <div className="st-brand">
          <span className="st-brand-dot" />
          PartyQuiz Studio
        </div>
        <div className="st-login-sub">Админка дизайна. Вход по паролю.</div>
        <input
          className="st-login-input"
          type="password"
          value={password}
          autoFocus
          placeholder="Пароль"
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <div className="st-err">{err}</div>}
        <button className="st-send" disabled={busy || !password}>
          {busy ? "Вход…" : "Войти"}
        </button>
      </form>
    </div>
  );
}

export default function Studio() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [screen, setScreen] = useState("home");
  const [reloadKey, setReloadKey] = useState(0);
  const doneCount = useRef(0);

  const refresh = useCallback(async () => {
    try {
      setTasks(await studio.listTasks());
    } catch (e) {
      if ((e as { status?: number }).status === 401) setAuthed(false);
    }
  }, []);

  useEffect(() => {
    studio.me().then(setAuthed);
  }, []);

  useEffect(() => {
    if (!authed) return;
    refresh();
    const fast = tasks.some((t) => t.status === "working");
    const id = setInterval(refresh, fast ? 1500 : 4000);
    return () => clearInterval(id);
  }, [authed, refresh, tasks]);

  useEffect(() => {
    const done = tasks.filter((t) => t.status === "done").length;
    if (done > doneCount.current && doneCount.current !== 0) {
      setReloadKey((k) => k + 1);
    }
    doneCount.current = done;
  }, [tasks]);

  if (authed === null) {
    return <div className="st-boot">…</div>;
  }
  if (!authed) {
    return <LoginGate onOk={() => setAuthed(true)} />;
  }

  return (
    <div className="st-root">
      <div className="st-left">
        <div className="st-brand">
          <span className="st-brand-dot" />
          PartyQuiz Studio
          <button
            className="st-logout"
            onClick={async () => {
              await studio.logout();
              setAuthed(false);
            }}
          >
            выйти
          </button>
        </div>
        <Composer onCreated={refresh} />
        <div className="st-feed">
          {tasks.length === 0 && (
            <div className="st-empty">
              Пусто. Кинь первую задачу с картинкой выше.
            </div>
          )}
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>

      <div className="st-right">
        <div className="st-preview-bar">
          <span>Живой экран</span>
          <select value={screen} onChange={(e) => setScreen(e.target.value)}>
            {SCREENS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            className="st-reload"
            title="Перезагрузить превью"
            onClick={() => setReloadKey((k) => k + 1)}
          >
            ⟳
          </button>
        </div>
        <iframe
          key={reloadKey}
          className="st-frame"
          title="preview"
          src={`${GALLERY}?solo=${screen}&v=${reloadKey}`}
        />
      </div>
    </div>
  );
}
