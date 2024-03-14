// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///Users/leo/workplace/code/zklink/zklink-airdrop-demo/node_modules/vite/dist/node/index.js";
import react from "file:///Users/leo/workplace/code/zklink/zklink-airdrop-demo/node_modules/@vitejs/plugin-react/dist/index.mjs";
var pathResolve = (path) => resolve(process.cwd(), path);
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": pathResolve("src"),
      "#": pathResolve("types")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 3e3,
    proxy: {
      "/twitter": {
        target: "https://api.twitter.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/twitter/, "")
      },
      "/api": {
        target: "https://test.app.zklink.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api")
      },
      "/points": {
        target: "https://test.app.zklink.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/points/, "/points")
      }
    }
  },
  build: {
    target: ["esnext"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGVvL3dvcmtwbGFjZS9jb2RlL3prbGluay96a2xpbmstYWlyZHJvcC1kZW1vXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGVvL3dvcmtwbGFjZS9jb2RlL3prbGluay96a2xpbmstYWlyZHJvcC1kZW1vL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sZW8vd29ya3BsYWNlL2NvZGUvemtsaW5rL3prbGluay1haXJkcm9wLWRlbW8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5cbmNvbnN0IHBhdGhSZXNvbHZlID0gKHBhdGg6IHN0cmluZyk6IHN0cmluZyA9PiByZXNvbHZlKHByb2Nlc3MuY3dkKCksIHBhdGgpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoUmVzb2x2ZShcInNyY1wiKSxcbiAgICAgIFwiI1wiOiBwYXRoUmVzb2x2ZShcInR5cGVzXCIpLFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL3R3aXR0ZXJcIjoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9hcGkudHdpdHRlci5jb21cIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvdHdpdHRlci8sIFwiXCIpLFxuICAgICAgfSxcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwczovL3Rlc3QuYXBwLnprbGluay5pb1wiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIi9hcGlcIiksXG4gICAgICB9LFxuICAgICAgXCIvcG9pbnRzXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vdGVzdC5hcHAuemtsaW5rLmlvXCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3BvaW50cy8sIFwiL3BvaW50c1wiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFtcImVzbmV4dFwiXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxTQUFTLGVBQWU7QUFDdFcsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBRWxCLElBQU0sY0FBYyxDQUFDLFNBQXlCLFFBQVEsUUFBUSxJQUFJLEdBQUcsSUFBSTtBQUd6RSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxZQUFZLEtBQUs7QUFBQSxNQUN0QixLQUFLLFlBQVksT0FBTztBQUFBLElBQzFCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLFFBQ1YsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGNBQWMsRUFBRTtBQUFBLE1BQ2xEO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxNQUFNO0FBQUEsTUFDbEQ7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxhQUFhLFNBQVM7QUFBQSxNQUN4RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRLENBQUMsUUFBUTtBQUFBLEVBQ25CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
