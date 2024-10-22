import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "webapp",
  envDir: "../",
  server: {
    port: 4435,
    host: "0.0.0.0",
    hmr: {
      host: "sport-story-hub-bot.local",
      port: 4435,
    },
    https: {
      key: fs.readFileSync(".cert/localhost-key.pem").toString(),
      cert: fs.readFileSync(".cert/localhost.pem").toString(),
    },
  },
});
