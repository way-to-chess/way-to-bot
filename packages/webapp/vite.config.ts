import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4434,
    host: "0.0.0.0",
  },
  resolve: {
    alias: [
      {
        find: "@way-to-bot/shared",
        replacement: resolve(__dirname, "../shared/src"),
      },
    ],
  },
});
