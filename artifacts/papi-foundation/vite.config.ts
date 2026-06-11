import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rawPort = process.env.PORT ?? "4173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  // The Replit-only dev plugins can fail in this VS Code workspace because
  // they try to scan directories outside the allowed local preview path.
  // Keep the app bootable here; the UI and runtime routes are unchanged.
  plugins: [react(), tailwindcss({ optimize: false })],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "src"),
      "@assets": path.resolve(dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(dirname),
  build: {
    outDir: path.resolve(dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/api": {
        target: process.env.API_PROXY_TARGET ?? "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
