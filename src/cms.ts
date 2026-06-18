const CMS = "/cms";

export interface Theme {
  bg: string;
  paw: string;
  surface: string;
  text_dark: string;
  text_gray: string;
  btn_light: string;
  accent_red: string;
  accent_coral: string;
  accent_purple: string;
  accent_green: string;
  dark_bg: string;
  card_lavender: string;
  font_heading: string;
  font_body: string;
}

export interface Illustration {
  slot: string;
  image: string | null;
  alt: string;
}

export interface CategoryAsset {
  category_id: number;
  image: string | null;
  video: string | null;
  badge: string;
  picked_pct: number;
}

const VAR_MAP: Record<keyof Theme, string> = {
  bg: "--pq-bg",
  paw: "--pq-paw",
  surface: "--pq-surface",
  text_dark: "--pq-text-dark",
  text_gray: "--pq-text-gray",
  btn_light: "--pq-btn-light",
  accent_red: "--pq-accent-red",
  accent_coral: "--pq-accent-coral",
  accent_purple: "--pq-accent-purple",
  accent_green: "--pq-accent-green",
  dark_bg: "--pq-dark-bg",
  card_lavender: "--pq-card-lavender",
  font_heading: "--pq-font-heading",
  font_body: "--pq-font-body",
};

export function assetUrl(id: string | null): string | null {
  return id ? `${CMS}/assets/${id}` : null;
}

export async function loadTheme(): Promise<void> {
  try {
    const r = await fetch(`${CMS}/items/theme`);
    if (!r.ok) return;
    const { data } = await r.json();
    const root = document.documentElement;
    for (const key of Object.keys(VAR_MAP) as (keyof Theme)[]) {
      const value = data[key];
      if (value) root.style.setProperty(VAR_MAP[key], value);
    }
  } catch {
    // defaults in index.css cover this
  }
}

export async function loadIllustrations(): Promise<
  Record<string, Illustration>
> {
  try {
    const r = await fetch(`${CMS}/items/illustrations`);
    if (!r.ok) return {};
    const { data } = await r.json();
    const map: Record<string, Illustration> = {};
    for (const item of data) map[item.slot] = item;
    return map;
  } catch {
    return {};
  }
}

export async function loadCategoryAssets(): Promise<
  Record<number, CategoryAsset>
> {
  try {
    const r = await fetch(`${CMS}/items/category_assets`);
    if (!r.ok) return {};
    const { data } = await r.json();
    const map: Record<number, CategoryAsset> = {};
    for (const item of data) map[item.category_id] = item;
    return map;
  } catch {
    return {};
  }
}
