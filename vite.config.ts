import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, ".") } },
  server: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app", "localhost"],
    hmr: process.env.DISABLE_HMR !== "true",
  },
  preview: { host: "0.0.0.0", allowedHosts: [".e2b.app", "localhost"] },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          supabase: ["@supabase/supabase-js"],
          validation: ["zod"],
        },
      },
    },
  },
});
