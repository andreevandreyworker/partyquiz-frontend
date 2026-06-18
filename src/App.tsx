import { AnimatePresence, motion } from "framer-motion";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      style={{ height: "100%" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { authed } = useAuth();
  const location = useLocation();

  if (!authed) {
    const onboarded = localStorage.getItem("pq_onboarded") === "1";
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/onboarding"
            element={
              <Page>
                <OnboardingScreen />
              </Page>
            }
          />
          <Route
            path="/login"
            element={
              <Page>
                <LoginScreen />
              </Page>
            }
          />
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
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Page>
              <HomeScreen />
            </Page>
          }
        />
        <Route
          path="/categories"
          element={
            <Page>
              <CategoriesScreen />
            </Page>
          }
        />
        <Route
          path="/join"
          element={
            <Page>
              <JoinScreen />
            </Page>
          }
        />
        <Route
          path="/settings"
          element={
            <Page>
              <SettingsScreen />
            </Page>
          }
        />
        <Route
          path="/profile"
          element={
            <Page>
              <ProfileScreen />
            </Page>
          }
        />
        <Route
          path="/premium"
          element={
            <Page>
              <PremiumScreen />
            </Page>
          }
        />
        <Route
          path="/login"
          element={
            <Page>
              <LoginScreen />
            </Page>
          }
        />
        <Route
          path="/room/:code"
          element={
            <Page>
              <RoomScreen />
            </Page>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
