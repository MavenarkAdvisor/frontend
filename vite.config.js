import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://gplank-test-eb-backend.ap-south-1.elasticbeanstalk.com/",
    },
  },
  plugins: [react()],
});
