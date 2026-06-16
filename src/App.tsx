import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import JoinScreen from "./screens/JoinScreen";
import RoomScreen from "./screens/RoomScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PremiumScreen from "./screens/PremiumScreen";

export default function App() {
  const { authed } = useAuth();

  if (!authed) {
    const onboarded = localStorage.getItem("pq_onboarded") === "1";
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="*"
          element={
            <Navigate
              to={onboarded ? "/login" : "/onboarding"}
              replace
            />
          }
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/categories" element={<CategoriesScreen />} />
      <Route path="/join" element={<JoinScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/premium" element={<PremiumScreen />} />
      <Route path="/room/:code" element={<RoomScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
