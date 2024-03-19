import { Wallet, getWalletConnectConnector } from "@rainbow-me/rainbowkit";
export interface MyWalletOptions {
  projectId: string;
}
export const BinanceWallet = ({ projectId }: MyWalletOptions): Wallet => ({
  id: "binance-wallet",
  name: "Binance DeFi Wallet",
  iconUrl: "/img/binance.svg",
  iconBackground: "#000",
  downloadUrls: {
    android: "https://www.binance.com/en/download",
    ios: "https://www.binance.com/en/download",
    chrome:
      "https://chromewebstore.google.com/detail/%E5%B8%81%E5%AE%89%E9%93%BE%E9%92%B1%E5%8C%85/fhbohimaelbohpjbbldcngcnapndodjp",
    qrCode: "https://okx.com/download",
  },
  mobile: {
    getUri: (uri: string) => uri,
  },
  qrCode: {
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: "https://www.binance.com/en/web3wallet",
      steps: [
        {
          description:
            "We recommend putting Binance Wallet on your home screen for faster access to your wallet.",
          step: "install",
          title: "Open the Binance Wallet app",
        },
        {
          description:
            "After you scan, a connection prompt will appear for you to connect your wallet.",
          step: "scan",
          title: "Tap the scan button",
        },
      ],
    },
  },
  extension: {
    instructions: {
      learnMoreUrl: "https://www.binance.com/en/web3wallet",
      steps: [
        {
          description:
            "We recommend pinning Binance Wallet to your taskbar for quicker access to your wallet.",
          step: "install",
          title: "Install the Binance Wallet extension",
        },
        {
          description:
            "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          step: "create",
          title: "Create or Import a Wallet",
        },
        {
          description:
            "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          step: "refresh",
          title: "Refresh your browser",
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({ projectId }),
});
