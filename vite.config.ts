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
        target: "https://goerli.app.zklink.io",
        // target: "https://app.zklink.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/points": {
        target: "https://goerli.app.zklink.io",
        // target: "https://app.zklink.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/points/, "/points"),
      },
    },
  },
  build: {
    target: ["esnext"],
    // rollupOptions: {
    //   output: {
    //     chunkFileNames: "js/[name]-[hash:8].js",
    //     entryFileNames: "js/[name]-[hash:8].js",
    //     assetFileNames: "[ext]/[name]-[hash:8].[ext]",
    //     // manualChunks: (id) => {
    //     //   if (id.includes("node_modules")) {
    //     //     return id
    //     //       .toString()
    //     //       .split("node_modules/")[1]
    //     //       .split("/")[0]
    //     //       .toString();
    //     //   }
    //     // },
    //   },
    // },
  },
});
