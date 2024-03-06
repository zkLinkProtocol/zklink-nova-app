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

// Setup queryClient for WAGMIv2
const queryClient = new QueryClient();

// Create Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: "dark",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
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
);
