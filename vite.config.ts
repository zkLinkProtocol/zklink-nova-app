import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pathResolve = (path: string): string => resolve(process.cwd(), path);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": pathResolve("src"),
      "#": pathResolve("types"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/twitter": {
        target: "https://api.twitter.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/twitter/, ""),
      },
      "/api": {
        // target: "https://goerli.app.zklink.io",
        target: "https://app.zklink.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/points": {
        // target: "https://goerli.app.zklink.io",
        target: "https://app.zklink.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/points/, "/points"),
      },
    },
  },
  build: {
    target: ["esnext"],
  },
});
