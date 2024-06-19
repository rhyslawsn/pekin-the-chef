import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "recipe-wiki-production.up.railway.app",
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
});
