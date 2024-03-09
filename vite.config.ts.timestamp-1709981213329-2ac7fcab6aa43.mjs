// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///Users/mickeywang/github/zklink/zklink-airdrop-demo/node_modules/vite/dist/node/index.js";
import react from "file:///Users/mickeywang/github/zklink/zklink-airdrop-demo/node_modules/@vitejs/plugin-react/dist/index.mjs";
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
    port: 3e3,
    proxy: {
      "/twitter": {
        target: "https://api.twitter.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/twitter/, "")
      },
      "/api": {
        target: "http://13.114.13.100:8097",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/points": {
        target: "http://13.114.13.100:8096",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/points/, "")
      },
      "/tokens": {
        target: "http://13.114.13.100:8096",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/points/, "")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlja2V5d2FuZy9naXRodWIvemtsaW5rL3prbGluay1haXJkcm9wLWRlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9taWNrZXl3YW5nL2dpdGh1Yi96a2xpbmsvemtsaW5rLWFpcmRyb3AtZGVtby92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWlja2V5d2FuZy9naXRodWIvemtsaW5rL3prbGluay1haXJkcm9wLWRlbW8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5cbmNvbnN0IHBhdGhSZXNvbHZlID0gKHBhdGg6IHN0cmluZyk6IHN0cmluZyA9PiByZXNvbHZlKHByb2Nlc3MuY3dkKCksIHBhdGgpXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoUmVzb2x2ZSgnc3JjJyksXG4gICAgICAnIyc6IHBhdGhSZXNvbHZlKCd0eXBlcycpLFxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBwcm94eToge1xuICAgICAgJy90d2l0dGVyJzoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cHM6Ly9hcGkudHdpdHRlci5jb21cIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvdHdpdHRlci8sICcnKVxuICAgICAgfSxcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovLzEzLjExNC4xMy4xMDA6ODA5N1wiLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJylcbiAgICAgIH0sXG4gICAgICAnL3BvaW50cyc6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMy4xMTQuMTMuMTAwOjgwOTZcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvcG9pbnRzLywgJycpXG4gICAgICB9LFxuICAgICAgJy90b2tlbnMnOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vMTMuMTE0LjEzLjEwMDo4MDk2XCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3BvaW50cy8sICcnKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFsnZXNuZXh0J11cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsU0FBUyxlQUFlO0FBQ25XLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUVsQixJQUFNLGNBQWMsQ0FBQyxTQUF5QixRQUFRLFFBQVEsSUFBSSxHQUFHLElBQUk7QUFHekUsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssWUFBWSxLQUFLO0FBQUEsTUFDdEIsS0FBSyxZQUFZLE9BQU87QUFBQSxJQUMxQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQSxRQUNWLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxjQUFjLEVBQUU7QUFBQSxNQUNsRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsYUFBYSxFQUFFO0FBQUEsTUFDakQ7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxhQUFhLEVBQUU7QUFBQSxNQUNqRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRLENBQUMsUUFBUTtBQUFBLEVBQ25CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
