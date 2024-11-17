import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as fs from "fs";
import { resolve } from "node:path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "way-to-bot.local",
    https: {
      key: fs.readFileSync(".cert/localhost-key.pem").toString(),
      cert: fs.readFileSync(".cert/localhost.pem").toString(),
    },
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
