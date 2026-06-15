import type {
  Category,
  Choice,
  Me,
  Room,
  Statement,
  Tokens,
} from "./types";

const TOKEN_KEY = "pq_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(path, { ...options, headers });
  if (!resp.ok) {
    let code = "error";
    try {
      code = (await resp.json()).code ?? "error";
    } catch {
      code = `http_${resp.status}`;
    }
    throw new Error(code);
  }
  if (resp.status === 204) return undefined as T;
  return resp.json();
}

export const api = {
  register: (login: string, password: string) =>
    request<Tokens>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    }),
  guest: (name: string) =>
    request<Tokens>("/auth/guest", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  login: (login: string, password: string) =>
    request<Tokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    }),
  me: () => request<Me>("/auth/me"),
  upgrade: () => request<Tokens>("/auth/upgrade", { method: "POST" }),
  categories: () => request<Category[]>("/game/categories"),
  createRoom: (mode: string, categories: string[]) =>
    request<Room>("/game/rooms", {
      method: "POST",
      body: JSON.stringify({ mode, categories }),
    }),
  joinRoom: (code: string) =>
    request<Room>("/game/rooms/join", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  getRoom: (code: string) => request<Room>(`/game/rooms/${code}`),
  submitStatement: (code: string, text: string) =>
    request<Statement>(`/game/rooms/${code}/statements`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  advance: (code: string) =>
    request<Room>(`/game/rooms/${code}/advance`, { method: "POST" }),
  reveal: (code: string) =>
    request<Room>(`/game/rooms/${code}/reveal`, { method: "POST" }),
  vote: (code: string, choice: Choice) =>
    request<Room>(`/game/rooms/${code}/vote`, {
      method: "POST",
      body: JSON.stringify({ choice }),
    }),
  fire: (code: string, statementId: string) =>
    request<{ fire_count: number }>(
      `/game/rooms/${code}/statements/${statementId}/fire`,
      { method: "POST" },
    ),
  leave: (code: string) =>
    request<{ status: string }>(`/game/rooms/${code}/leave`, {
      method: "POST",
    }),
  suggest: (draft: string, language: string) =>
    request<{ question: string }>("/ai/suggest", {
      method: "POST",
      body: JSON.stringify({ draft, language }),
    }),
};
