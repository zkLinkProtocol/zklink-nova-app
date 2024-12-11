import { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home/index-end";
import Toast from "./components/Toast";
import Countdown from "@/components/Countdown";
import styled from "styled-components";
import AggregationParade from "./pages/AggregationParade";
import UnwrapETH from "@/pages/UnwrapETH";
import DashboardS2 from "./pages/DashboardS2/index2";
import { useLanguageStore } from "./hooks/useLanguageStore";
import { useTranslation } from "react-i18next";

// const AggregationParade = lazy(() => import("@/pages/AggregationParade"));
// const Dashboard = lazy(() => import("@/pages/AggregationParade/Dashboard"));
// const Leaderboard = lazy(() => import("@/pages/Leaderboard"));
// const About = lazy(() => import("@/pages/About"));
// const Bridge = lazy(() => import('@/pages/Bridge'))

const HideBox = styled.div`
  position: absolute;
  left: -9999px;
  top: -9999px;
`;

export default function App() {
  const { language } = useLanguageStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [i18n.language, language]);

  return (
    <main className="main dark text-foreground bg-background header lg:min-w-[1080px]">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback="">
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/invite/:code"
            element={
              <Suspense fallback="">
                <Home />
              </Suspense>
            }
          ></Route>

          <Route
            path="/aggregation-parade"
            element={
              <Suspense fallback="">
                <AggregationParade />
              </Suspense>
            }
          />

          <Route
            path="/unwrap"
            element={
              <Suspense fallback="">
                <UnwrapETH />
              </Suspense>
            }
          />
        </Routes>
        <Toast />
        <HideBox className="">
          <Countdown />
        </HideBox>
      </BrowserRouter>
    </main>
  );
}
