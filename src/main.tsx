import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { WagmiProvider } from "wagmi";
import { wagmiDefaultConfig } from "./constants/networks.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import "./styles/global.css";
import Maintenance from "./components/Maintenance.tsx";
const isMaintenance = import.meta.env.VITE_IS_MAINTENANCE;
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "./i18n.ts";

const queryClient = new QueryClient();

try {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    +isMaintenance ? (
      <Maintenance />
    ) : (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <WagmiProvider config={wagmiDefaultConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                <NextUIProvider>
                  <App />
                </NextUIProvider>
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </PersistGate>
      </Provider>
    )
  );
} catch (e) {
  console.error(e);
  throw e;
}
