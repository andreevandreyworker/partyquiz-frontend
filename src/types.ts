export interface Tokens {
  access_token: string;
  user_id: string;
  login: string;
}

export interface Category {
  id: string;
  ru: string;
  en: string;
}

export interface Player {
  user_id: string;
  login: string;
  is_host: boolean;
}

export interface Statement {
  id: string;
  text: string;
  source: string;
  author_login: string | null;
  fire_count: number;
}

export type Choice = "norm" | "cringe";

export interface Tally {
  norm: number;
  cringe: number;
}

export interface Room {
  id: string;
  code: string;
  mode: string;
  status: string;
  phase: string;
  categories: string[];
  host_user_id: string;
  players: Player[];
  current_question: Statement | null;
  voted_count: number;
  my_vote: Choice | null;
  tally: Tally | null;
  pending_count: number;
}

export type WsEvent =
  | { type: "player_joined"; login: string }
  | { type: "player_left"; user_id: string }
  | { type: "host_changed"; login: string }
  | { type: "statement_queued"; author_login: string }
  | { type: "statement_shown"; question: Statement }
  | { type: "vote_progress"; voted_count: number }
  | { type: "revealed"; question_id: string; tally: Tally }
  | { type: "fire_update"; question_id: string; fire_count: number };
