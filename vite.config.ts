import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Rebuild trigger v6
export default defineConfig(({ mode }) => ({
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://decpnryjxjdxqmzneupu.supabase.co"),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlY3BucnlqeGpkeHFtem5ldXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NDI1NjEsImV4cCI6MjA4NzQxODU2MX0.n5Um-giKX1l9nwn_BNe-IFwCQI7cxta5pHG1WDgNC_s"),
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify("decpnryjxjdxqmzneupu"),
  },
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
