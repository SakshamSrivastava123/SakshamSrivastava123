import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,       // dev server port
   proxy: {
      "/api": {
        target: "https://localhost:61209",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
