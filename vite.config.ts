import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (!env.VITE_PROXY_TARGET) {
    throw new Error("VITE_PROXY_TARGET is missing from .env");
  }

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },

    server: {
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: "",
          cookiePathRewrite: "/",
          headers: { "ngrok-skip-browser-warning": "true" },
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes, req) => {
              const setCookie = (proxyRes.headers["set-cookie"] ?? []).map(
                (c) => c.replace(/=[^;]*/, "=<redacted>"),
              );
              console.log(
                "[Proxy Response]",
                proxyRes.statusCode,
                req.url,
                setCookie,
              );

              if (req.url?.includes("/auth/me")) {
                proxyRes.headers["cache-control"] = "no-store";
              }
            });

            proxy.on("proxyRes", (proxyRes, req) => {
              console.log("[Proxy Response]", proxyRes.statusCode, req.url);
            });

            proxy.on("error", (error, req) => {
              console.error("[Proxy Error]", req.url, error.message);
            });
          },
        },
      },
    },
  };
});
