import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Component, type ReactNode } from "react";
import { AuthProvider } from "./auth";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import JoinScreen from "./screens/JoinScreen";
import RoomScreen from "./screens/RoomScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PremiumScreen from "./screens/PremiumScreen";
import LoadingScreen from "./components/LoadingScreen";

interface Item {
  id: string;
  title: string;
  route: string;
  pattern: string;
  element: React.ReactNode;
}

class Boundary extends Component<
  { children: ReactNode },
  { failed: boolean; msg: string }
> {
  state = { failed: false, msg: "" };
  static getDerivedStateFromError(e: Error) {
    return { failed: true, msg: e.message };
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="gx-crash">
          <div className="gx-crash-x">⚠</div>
          <div className="gx-crash-msg">{this.state.msg}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

const SCREENS: Item[] = [
  { id: "onboarding", title: "Онбординг", route: "/onboarding", pattern: "/onboarding", element: <OnboardingScreen /> },
  { id: "login", title: "Вход / Регистрация", route: "/login", pattern: "/login", element: <LoginScreen /> },
  { id: "home", title: "Главный", route: "/", pattern: "/", element: <HomeScreen /> },
  { id: "categories", title: "Выбор категорий (свайп)", route: "/categories?mode=multi", pattern: "/categories", element: <CategoriesScreen /> },
  { id: "join", title: "Подключение по коду", route: "/join", pattern: "/join", element: <JoinScreen /> },
  { id: "loading", title: "Загрузка (кольцо)", route: "/loading", pattern: "/loading", element: <LoadingScreen /> },
  { id: "room-lobby", title: "Лобби комнаты", route: "/room/LOBBY", pattern: "/room/:code", element: <RoomScreen /> },
  { id: "room-vote", title: "Голосование + 🔥", route: "/room/VOTE07", pattern: "/room/:code", element: <RoomScreen /> },
  { id: "room-voted", title: "Голосование (мой голос)", route: "/room/VOTED", pattern: "/room/:code", element: <RoomScreen /> },
  { id: "room-reveal", title: "Результат голосов", route: "/room/REVEAL", pattern: "/room/:code", element: <RoomScreen /> },
  { id: "profile", title: "Профиль", route: "/profile", pattern: "/profile", element: <ProfileScreen /> },
  { id: "premium", title: "Премиум", route: "/premium", pattern: "/premium", element: <PremiumScreen /> },
  { id: "settings", title: "Настройки", route: "/settings", pattern: "/settings", element: <SettingsScreen /> },
];

function Phone({ item }: { item: Item }) {
  return (
    <div className="gx-cell" data-screen={item.id}>
      <div className="gx-label">{item.title}</div>
      <div className="gx-phone">
        <div className="gx-screen">
          <Boundary>
            <AuthProvider>
              <MemoryRouter initialEntries={[item.route]}>
                <Routes>
                  <Route path={item.pattern} element={item.element} />
                  <Route path="*" element={item.element} />
                </Routes>
              </MemoryRouter>
            </AuthProvider>
          </Boundary>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const params = new URLSearchParams(window.location.search);
  const solo = params.get("solo");

  if (solo) {
    const item = SCREENS.find((s) => s.id === solo);
    if (!item) {
      return <div className="gx-solo-miss">no screen: {solo}</div>;
    }
    return (
      <div className="gx-solo">
        <Boundary>
          <AuthProvider>
            <MemoryRouter initialEntries={[item.route]}>
              <Routes>
                <Route path={item.pattern} element={item.element} />
                <Route path="*" element={item.element} />
              </Routes>
            </MemoryRouter>
          </AuthProvider>
        </Boundary>
      </div>
    );
  }

  return (
    <div className="gx-root">
      <div className="gx-head">
        <div className="gx-h1">Норм или Стрём — экраны</div>
        <div className="gx-sub">Живой рендер приложения · {SCREENS.length} экранов</div>
      </div>
      <div className="gx-grid">
        {SCREENS.map((s) => (
          <Phone key={s.id} item={s} />
        ))}
      </div>
    </div>
  );
}
