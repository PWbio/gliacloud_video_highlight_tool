import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import crossOriginIsolation from "vite-plugin-cross-origin-isolation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crossOriginIsolation()],
  resolve: {
    /** Path Alias */
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },
});
