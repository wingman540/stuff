import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// When building for GitHub Pages the app is served from https://<user>.github.io/stuff/,
// so production assets need the "/stuff/" base. The dev server stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/stuff/" : "/",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}));
