import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: {
    translation: {
      app_title: "PartyQuiz",
      ob_skip: "Пропустить",
      ob_next: "Дальше",
      ob_continue: "Продолжить",
      ob1_title: "PartyQuiz",
      ob1_text:
        "Весёлая игра для компании. Отвечайте на вопросы вслух — вместе.",
      ob2_title: "Комната на всех",
      ob2_text:
        "Создай комнату и позови друзей по коду. Или подключись к чужой.",
      ob3_title: "Твои правила",
      ob3_text:
        "Добавляй свои вопросы (поможет ИИ) и зажигай 🔥 лучшие. Игра не кончается.",
      your_name: "Как тебя зовут?",
      play: "Играть",
      use_account: "Войти с аккаунтом",
      use_guest: "Играть как гость",
      login: "Логин",
      password: "Пароль",
      sign_in: "Войти",
      sign_up: "Регистрация",
      to_register: "Нет аккаунта? Регистрация",
      to_login: "Уже есть аккаунт? Войти",
      logout: "Выйти",
      create_room: "Создать комнату",
      join_room: "Подключиться к комнате",
      solo: "Одиночная игра",
      enter_code: "Введите код комнаты",
      connect: "Подключиться",
      back: "Назад",
      pick_categories: "Выбор категорий",
      swipe_hint: "Норм или стрём?",
      norm: "Норм 👍",
      skip: "Стрём 👎",
      start: "Начать",
      room_code: "Код комнаты",
      players: "Участники",
      host: "хост",
      share_code: "Сообщи код друзьям",
      waiting: "Ждём участников…",
      begin_game: "Поехали",
      vote_norm: "Норм 👍",
      vote_cringe: "Стрём 👎",
      reveal: "Показать результат",
      next_statement: "Дальше",
      next_in: "Следующее через {{n}}…",
      next_now: "Дальше сейчас",
      begin_round: "Начать",
      voted_n: "проголосовали",
      you_voted: "Твой голос",
      waiting_host: "Ждём ведущего…",
      waiting_votes: "Ждём голоса…",
      add_statement: "Своё утверждение",
      your_statement: "Ваше утверждение",
      statement_ph: "Напр.: ананас на пицце",
      result_norm: "Норм",
      result_cringe: "Стрём",
      next_question: "Следующий вопрос",
      add_question: "Свой вопрос",
      your_question: "Ваш вопрос",
      ai_help: "Помощь ИИ",
      ai_thinking: "ИИ придумывает",
      send: "Отправить",
      cancel: "Отмена",
      in_queue: "в очереди",
      by: "от",
      from_bank: "из банка",
      from_ai: "от ИИ",
      leave: "Выйти из комнаты",
      settings: "Настройки",
      profile: "Профиль",
      language: "Язык",
      account: "Аккаунт",
      about: "О приложении",
      about_text: "PartyQuiz — вечеринка в кармане. Прототип.",
      status: "Статус",
      free_plan: "Бесплатный",
      premium_plan: "Премиум",
      go_premium: "Стать премиум",
      premium_active: "Премиум активен 🎉",
      premium_title: "PartyQuiz Premium",
      premium_perk_hot: "Категория 18+",
      premium_perk_ai: "Безлимит ИИ-помощи",
      premium_perk_codes: "Кастомные коды комнат",
      activate: "Активировать",
      activating: "Активируем…",
      account_required: "Нужен аккаунт — войди или зарегистрируйся",
      create_account: "Создать аккаунт",
      premium_locked: "Премиум",
      guest_label: "Гость",
      premium_subtitle: "Открой вечеринку полностью",
      premium_cta: "Оформить Premium",
      premium_only_registered:
        "Premium доступен только зарегистрированным",
      plan_monthly: "Помесячно",
      plan_yearly: "На год",
      per_month: "/мес",
      per_year: "/год",
      price_monthly: "199 ₽",
      price_yearly: "1 490 ₽",
      yearly_save: "Выгода 38%",
      best_value: "Выгоднее всего",
      whats_included: "Что входит",
      perk_hot_t: "Категория 18+",
      perk_hot_d: "Пикантные вопросы для взрослой компании",
      perk_ai_t: "Безлимитная ИИ-помощь",
      perk_ai_d: "Составляй идеальные вопросы без ограничений",
      perk_codes_t: "Свои коды комнат",
      perk_codes_d: "Запоминающийся код вместо случайного",
      perk_noads_t: "Без рекламы",
      perk_noads_d: "Ничто не отвлекает от игры",
      perk_rooms_t: "Большие комнаты",
      perk_rooms_d: "Приглашай больше друзей в одну игру",
      perk_badge_t: "Премиум-значок",
      perk_badge_d: "Выделяйся в списке игроков",
      home_premium_banner: "Открой всё с Premium",
      premium_thanks: "Спасибо, что выбрал Premium! 🎉",
      start_game: "Начать игру",
      home_slogan: "Голосуй. Спорь. Веселись.",
      enter_room: "Войти в комнату",
      logo_top: "НОРМ",
      logo_bottom: "СТРЁМ",
      logo_or: "или",
      teaser_label: "Пример вопроса",
      chip_norm: "норм",
      chip_strem: "стрём",
      teaser_items: [
        "Списать на экзамене",
        "Лайкнуть фото бывшего в 2 ночи",
        "Гуглить симптомы простуды",
        "Ананасы на пицце",
        "Прочитать чужую переписку",
        "Петь в караоке трезвым",
        "Ответить «ок» на длинное сообщение",
        "Отмечать день рождения заранее",
      ],
      loading_title: "Готовим игру…",
      loading_sub: "Тасуем карточки и зовём котика",
      loading_tip: "Свайпни вправо «норм», влево «стрём»",
      adding_category: "Добавляем",
      adding_category_q: "категорию?",
      pick_hint: "Можно несколько",
      picked_stat: "Выбрали {{pct}}%",
      picked_count: "Выбрано: {{n}} из {{total}}",
      lobby_title: "Комната готова!",
      lobby_share: "Скинь код друзьям",
      players_n: "Игроков: {{n}}",
      round_q: "Что скажешь?",
      err_login_taken: "Логин занят",
      err_invalid_credentials: "Неверный логин или пароль",
      err_login_short: "Логин минимум 3 символа",
      err_pass_short: "Пароль минимум 4 символа",
      err_room_not_found: "Комната не найдена",
      err_too_many_pending: "Слишком много вопросов в очереди",
      err_ai_unavailable: "ИИ недоступен, попробуйте позже",
      err_not_host: "Только хост может листать",
      err_generic: "Что-то пошло не так",
    },
  },
  en: {
    translation: {
      app_title: "PartyQuiz",
      ob_skip: "Skip",
      ob_next: "Next",
      ob_continue: "Continue",
      ob1_title: "PartyQuiz",
      ob1_text:
        "A fun game for your crew. Answer questions out loud — together.",
      ob2_title: "One room for all",
      ob2_text:
        "Create a room and invite friends by code. Or join someone else's.",
      ob3_title: "Your rules",
      ob3_text:
        "Add your own questions (AI helps) and fire 🔥 the best ones. The game never ends.",
      your_name: "What's your name?",
      play: "Play",
      use_account: "Sign in with account",
      use_guest: "Play as guest",
      login: "Login",
      password: "Password",
      sign_in: "Sign in",
      sign_up: "Sign up",
      to_register: "No account? Sign up",
      to_login: "Have an account? Sign in",
      logout: "Log out",
      create_room: "Create room",
      join_room: "Join room",
      solo: "Solo game",
      enter_code: "Enter room code",
      connect: "Connect",
      back: "Back",
      pick_categories: "Pick categories",
      swipe_hint: "Cool or cringe?",
      norm: "Cool 👍",
      skip: "Cringe 👎",
      start: "Start",
      room_code: "Room code",
      players: "Players",
      host: "host",
      share_code: "Share the code with friends",
      waiting: "Waiting for players…",
      begin_game: "Let's go",
      vote_norm: "Cool 👍",
      vote_cringe: "Cringe 👎",
      reveal: "Reveal",
      next_statement: "Next",
      next_in: "Next in {{n}}…",
      next_now: "Next now",
      begin_round: "Start",
      voted_n: "voted",
      you_voted: "Your vote",
      waiting_host: "Waiting for host…",
      waiting_votes: "Waiting for votes…",
      add_statement: "Add statement",
      your_statement: "Your statement",
      statement_ph: "e.g. pineapple on pizza",
      result_norm: "Cool",
      result_cringe: "Cringe",
      next_question: "Next question",
      add_question: "Add question",
      your_question: "Your question",
      ai_help: "AI help",
      ai_thinking: "AI is cooking",
      send: "Send",
      cancel: "Cancel",
      in_queue: "in queue",
      by: "by",
      from_bank: "from bank",
      from_ai: "by AI",
      leave: "Leave room",
      settings: "Settings",
      profile: "Profile",
      language: "Language",
      account: "Account",
      about: "About",
      about_text: "PartyQuiz — a party in your pocket. Prototype.",
      status: "Status",
      free_plan: "Free",
      premium_plan: "Premium",
      go_premium: "Go Premium",
      premium_active: "Premium active 🎉",
      premium_title: "PartyQuiz Premium",
      premium_perk_hot: "18+ category",
      premium_perk_ai: "Unlimited AI help",
      premium_perk_codes: "Custom room codes",
      activate: "Activate",
      activating: "Activating…",
      account_required: "Account required — sign in or sign up",
      create_account: "Create account",
      premium_locked: "Premium",
      guest_label: "Guest",
      premium_subtitle: "Unlock the full party",
      premium_cta: "Get Premium",
      premium_only_registered:
        "Premium is available to registered users only",
      plan_monthly: "Monthly",
      plan_yearly: "Yearly",
      per_month: "/mo",
      per_year: "/yr",
      price_monthly: "199 ₽",
      price_yearly: "1 490 ₽",
      yearly_save: "Save 38%",
      best_value: "Best value",
      whats_included: "What's included",
      perk_hot_t: "18+ Category",
      perk_hot_d: "Spicy questions for grown-up company",
      perk_ai_t: "Unlimited AI help",
      perk_ai_d: "Craft perfect questions with no limits",
      perk_codes_t: "Custom room codes",
      perk_codes_d: "A memorable code instead of a random one",
      perk_noads_t: "No ads",
      perk_noads_d: "Nothing distracts from the game",
      perk_rooms_t: "Bigger rooms",
      perk_rooms_d: "Invite more friends into a single game",
      perk_badge_t: "Premium badge",
      perk_badge_d: "Stand out in the player list",
      home_premium_banner: "Unlock everything with Premium",
      premium_thanks: "Thanks for going Premium! 🎉",
      start_game: "Start game",
      home_slogan: "Vote. Argue. Have fun.",
      enter_room: "Enter room",
      logo_top: "FINE",
      logo_bottom: "CRINGE",
      logo_or: "or",
      teaser_label: "Example question",
      chip_norm: "fine",
      chip_strem: "cringe",
      teaser_items: [
        "Cheating on an exam",
        "Liking your ex's photo at 2am",
        "Googling cold symptoms",
        "Pineapple on pizza",
        "Reading someone's texts",
        "Karaoke while sober",
        "Replying \"ok\" to a long message",
        "Celebrating your birthday early",
      ],
      loading_title: "Getting ready…",
      loading_sub: "Shuffling cards and calling the cat",
      loading_tip: "Swipe right for “norm”, left for “cringe”",
      adding_category: "Adding a",
      adding_category_q: "category?",
      pick_hint: "Choose a few",
      picked_stat: "{{pct}}% picked it",
      picked_count: "Picked: {{n}} of {{total}}",
      lobby_title: "Room is ready!",
      lobby_share: "Share the code with friends",
      players_n: "Players: {{n}}",
      round_q: "What do you say?",
      err_login_taken: "Login already taken",
      err_invalid_credentials: "Wrong login or password",
      err_login_short: "Login: at least 3 characters",
      err_pass_short: "Password: at least 4 characters",
      err_room_not_found: "Room not found",
      err_too_many_pending: "Too many questions in queue",
      err_ai_unavailable: "AI unavailable, try later",
      err_not_host: "Only the host can advance",
      err_generic: "Something went wrong",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("pq_lang") ?? "ru",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

const CACHE_KEY = "pq_i18n_cache";

function hydrate(raw: string): unknown {
  if (raw && (raw[0] === "[" || raw[0] === "{")) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

try {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
  for (const [lng, dict] of Object.entries(cached))
    i18n.addResourceBundle(lng, "translation", dict, true, true);
} catch {
  // bundled floor covers this
}

export async function refreshTranslations(): Promise<void> {
  try {
    const lr = await fetch(
      "/cms/items/languages?filter[enabled][_eq]=true" +
        "&fields=code&sort=sort&limit=-1",
    );
    const langs: string[] = lr.ok
      ? (await lr.json()).data.map((l: { code: string }) => l.code)
      : ["ru", "en"];
    const cache: Record<string, Record<string, unknown>> = {};
    for (const lng of langs) {
      const r = await fetch(
        `/cms/items/ui_translations?filter[lang][_eq]=${lng}` +
          "&fields=key,value&limit=-1",
      );
      if (!r.ok) continue;
      const { data } = await r.json();
      const dict: Record<string, unknown> = {};
      for (const row of data) dict[row.key] = hydrate(row.value);
      i18n.addResourceBundle(lng, "translation", dict, true, true);
      cache[lng] = dict;
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    i18n.changeLanguage(i18n.language);
  } catch {
    // bundled floor + cache already applied
  }
}

export async function loadLanguages(): Promise<
  { code: string; name: string; flag: string }[]
> {
  try {
    const r = await fetch(
      "/cms/items/languages?filter[enabled][_eq]=true" +
        "&fields=code,name,flag&sort=sort&limit=-1",
    );
    if (!r.ok) return [];
    return (await r.json()).data;
  } catch {
    return [];
  }
}

export function setLang(lang: string): void {
  localStorage.setItem("pq_lang", lang);
  i18n.changeLanguage(lang);
}

export default i18n;
