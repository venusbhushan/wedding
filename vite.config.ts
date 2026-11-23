import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
 plugins: [react()],
 build: { rolldownOptions: { input: { wedding: "index.html", guests: "guests/index.html" } } },
 server: {
  proxy: {
   "/api": {
    target: "http://127.0.0.1:5176",
    changeOrigin: false,
   },
  },
 },
});
