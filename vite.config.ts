import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

const pathResolve = (path: string): string => resolve(process.cwd(), path);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false }),
    {
      ...viteCompression(),
      apply: "build",
    },
    // chunkSplitPlugin({
    //   strategy: "single-vendor",
    //   customChunk: (args) => {
    //     // files into pages directory is export in single files
    //     let { file, id, moduleId, root } = args;
    //     if (file.startsWith("src/pages/")) {
    //       file = file.substring(4);
    //       file = file.replace(/\.[^.$]+$/, "");
    //       return file;
    //     }
    //     return null;
    //   },
    //   // customSplitting: {
    //   //   // `react` and `react-dom` will be bundled together in the `react-vendor` chunk (with their dependencies, such as object-assign)
    //   //   // "react-vendor": ["react", "react-dom"],
    //   //   // Any file that includes `utils` in src dir will be bundled in the `utils` chunk
    //   //   components: [/src\/components/],
    //   // },
    // }),
  ],
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
      "/app-api": {
        target: "https://app-api.zklink.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/app-api/, ""),
      },
    },
  },
  build: {
    target: ["esnext"],
    chunkSizeWarningLimit: 1600,
    // rollupOptions: {
    //   output: {
    //     chunkFileNames: "static/js/[name]-[hash].js",
    //     entryFileNames: "static/js/[name]-[hash].js",
    //     assetFileNames: "static/[ext]/[name]-[hash].[ext]",
    //     manualChunks: {
    //       react: ["react", "react-dom", "react-router-dom"],
    //       nextui: ["@nextui-org/react"],
    //       lodash: ["lodash"],
    //     },
    //   },

    // },
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
