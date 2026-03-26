import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: __dirname,
  server: {
    port: 3000,
    proxy: {
      "/todos": "http://localhost:3001",
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../../dist/frontend"),
  },
});
