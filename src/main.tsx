import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider } from "wagmi";
import { arbitrum, mainnet, goerli, lineaTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import "./styles/global.css";

// Setup queryClient for WAGMIv2
const queryClient = new QueryClient();

// Get WalletConnect projectId
const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error("VITE_PROJECT_ID is not set");
}

// Create wagmiConfig
const wagmiConfig = defaultWagmiConfig({
  chains: [goerli, mainnet, arbitrum, lineaTestnet],
  projectId,
  metadata: {
    name: "Web3Modal React Example",
    description: "Web3Modal React Example",
    url: "",
    icons: [],
  },
});

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
