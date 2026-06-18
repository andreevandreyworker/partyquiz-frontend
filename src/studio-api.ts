const BASE = "/api";

export interface Step {
  kind: string;
  text: string;
  created_at: string;
}

export interface Task {
  id: string;
  screen_id: string;
  prompt: string;
  status: string;
  images: string[];
  reply: string | null;
  result_image: string | null;
  steps: Step[];
  created_at: string;
  updated_at: string;
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "same-origin", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.code || `http_${res.status}`);
    (err as { status?: number }).status = res.status;
    throw err;
  }
  return res.json();
}

export const studio = {
  async me(): Promise<boolean> {
    try {
      await jsonFetch(`${BASE}/me`);
      return true;
    } catch {
      return false;
    }
  },

  async login(password: string): Promise<void> {
    await jsonFetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
  },

  async logout(): Promise<void> {
    await jsonFetch(`${BASE}/logout`, { method: "POST" });
  },

  async listTasks(): Promise<Task[]> {
    return jsonFetch(`${BASE}/tasks`);
  },

  async createTask(screenId: string, prompt: string): Promise<Task> {
    return jsonFetch(`${BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screen_id: screenId, prompt }),
    });
  },

  async uploadImage(taskId: string, file: File | Blob): Promise<Task> {
    const fd = new FormData();
    fd.append("file", file);
    return jsonFetch(`${BASE}/tasks/${taskId}/images`, {
      method: "POST",
      body: fd,
    });
  },

  uploadUrl(name: string): string {
    return `${BASE}/uploads/${name}`;
  },

  resultUrl(name: string): string {
    return `${BASE}/results/${name}`;
  },
};
