import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, projectId } from "./constants/networks.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import "./styles/global.css";
import Maintenance from "./components/Maintenance.tsx";
const isMaintenance = import.meta.env.VITE_IS_MAINTENANCE;
// Setup queryClient for WAGMIv2
const queryClient = new QueryClient();

// Create Web3Modal
createWeb3Modal({
  featuredWalletIds: [
    // "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",rainbow
    // "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // okx wallet
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", // binance web3 wallet
    "c7708575a2c3c9e6a8ab493d56cdcc56748f03956051d021b8cd8d697d9a3fd2", // fox wallet
  ],
  excludeWalletIds: [
    "541d5dcd4ede02f3afaf75bf8e3e4c4f1fb09edb5fa6c4377ebf31c2785d9adf", // ronin wallet
  ],
  allWallets: "HIDE",
  wagmiConfig,
  projectId,
  themeMode: "dark",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  +isMaintenance ? (
    <Maintenance />
  ) : (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <NextUIProvider>
              <App />
            </NextUIProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </Provider>
  )
);
