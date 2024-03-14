import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import Toast from "./components/Toast";
import Countdown from "@/components/Countdown";
import styled from "styled-components";
import AggregationParade from "./pages/AggregationParade";
import Bridge from "@/pages/Bridge";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import { useDispatch } from "react-redux";
import { setInviteCode } from "./store/modules/airdrop";

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
  return (
    <main className="main dark text-foreground bg-background header lg:min-w-[1080px]">
      <BrowserRouter>
        <Header />

        <Routes>
          {/* <Route path="/" element={<Navigate to="/aggregation-parade" />} /> */}
          <Route
            path="/"
            element={
              <Suspense fallback="">
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/aggregation-parade"
            element={
              <Suspense fallback="">
                <AggregationParade />
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback="">
                <Dashboard />
              </Suspense>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <Suspense fallback="">
                <Leaderboard />
              </Suspense>
            }
          />

          <Route
            path="/about"
            element={
              <Suspense fallback="">
                <About />
              </Suspense>
            }
          />
          <Route
            path="/bridge"
            element={
              <Suspense fallback="">
                <Bridge />
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
