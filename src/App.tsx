import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home/index-end";
import Toast from "./components/Toast";
import Countdown from "@/components/Countdown";
import styled from "styled-components";
import AggregationParade from "./pages/AggregationParade";
import UnwrapETH from "@/pages/UnwrapETH";

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
