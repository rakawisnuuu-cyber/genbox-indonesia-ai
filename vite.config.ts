import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Rebuild trigger v5 - force dep optimization reset
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5000,
    hmr: {
      overlay: false,
    },
    allowedHosts: [
      "d200c54d-02b2-42a4-91d9-7bbb604ff954-00-1nso2sqzhpzxb.riker.replit.dev",
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
