const CATS = [
  { id: 1, ru: "Друзья", en: "Friends", premium: false, icon: "👯" },
  { id: 3, ru: "Свидания", en: "Dating", premium: false, icon: "❤️" },
  { id: 9, ru: "Работа", en: "Work", premium: false, icon: "💼" },
  { id: 4, ru: "По душам", en: "Deep talk", premium: false, icon: "🤔" },
  { id: 2, ru: "Неловкие", en: "Awkward", premium: false, icon: "😬" },
  { id: 7, ru: "18+", en: "18+", premium: true, icon: "🌶️" },
];

const PLAYERS = [
  { user_id: "u1", login: "Аня", is_host: true },
  { user_id: "u2", login: "Макс", is_host: false },
  { user_id: "u3", login: "Лера", is_host: false },
  { user_id: "u4", login: "Дима", is_host: false },
];

function room(code: string, extra: Record<string, unknown>) {
  return {
    id: "r_" + code,
    code,
    mode: "multi",
    status: "active",
    host_user_id: "u1",
    categories: [1, 3],
    players: PLAYERS,
    current_question: null,
    voted_count: 0,
    my_vote: null,
    tally: null,
    pending_count: 0,
    ...extra,
  };
}

const Q_VOTE = {
  id: "q1",
  text: "Признаться в любви через голосовое — это норм?",
  source: "user",
  author_login: "Макс",
  fire_count: 3,
};

const Q_REVEAL = {
  id: "q2",
  text: "Ананас на пицце — это норм?",
  source: "bank",
  author_login: null,
  fire_count: 7,
};

const ROOMS: Record<string, unknown> = {
  LOBBY: room("LOBBY", { phase: "lobby", status: "lobby" }),
  VOTE07: room("VOTE07", {
    phase: "voting",
    current_question: Q_VOTE,
    voted_count: 2,
  }),
  VOTED: room("VOTED", {
    phase: "voting",
    current_question: Q_VOTE,
    voted_count: 3,
    my_vote: "norm",
  }),
  REVEAL: room("REVEAL", {
    phase: "revealed",
    current_question: Q_REVEAL,
    voted_count: 4,
    tally: { norm: 3, cringe: 1 },
  }),
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function installMocks(): void {
  localStorage.setItem("pq_token", "gallery");
  localStorage.setItem("pq_user_id", "u1");
  localStorage.setItem("pq_login", "Аня");
  localStorage.setItem("pq_premium", "1");
  localStorage.setItem("pq_account", "1");
  localStorage.setItem("pq_onboarded", "1");

  const realFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const path = url.replace(location.origin, "").split("?")[0];

    if (path === "/auth/me")
      return json({ user_id: "u1", login: "Аня", is_premium: true });
    if (path === "/auth/upgrade")
      return json({
        access_token: "gallery",
        user_id: "u1",
        login: "Аня",
        is_premium: true,
      });
    if (path === "/game/categories") return json(CATS);
    if (path === "/ai/suggest")
      return json({
        question: "Если бы у тебя был кот-телепат — это норм или стрём?",
      });
    if (path.startsWith("/game/rooms/")) {
      const code = path.split("/")[3];
      const r = ROOMS[code] ?? ROOMS.LOBBY;
      if (path.endsWith("/fire")) return json({ fire_count: 8 });
      if (path.endsWith("/leave")) return json({ status: "ok" });
      return json(r);
    }
    if (path.startsWith("/cms")) return json({ data: [] }, 200);

    if (path.startsWith("/auth") || path.startsWith("/game"))
      return json(ROOMS.LOBBY);

    return realFetch(input as RequestInfo, init);
  };

  class FakeWS {
    readyState = 1;
    onmessage: ((e: MessageEvent) => void) | null = null;
    onopen: (() => void) | null = null;
    onclose: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor() {
      /* inert */
    }
    send() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  }
  (window as unknown as { WebSocket: unknown }).WebSocket = FakeWS;
}
