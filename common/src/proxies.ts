import type { Options } from "http-proxy-middleware";
import { CONSOLE_ENV } from "./environment.js";

export const proxyMap: Record<string, Options> = {
  "/api": {
    target: CONSOLE_ENV.CONSOLE_API_URL ?? "http://localhost:8080",
    logLevel: process.env.DEBUG ? "debug" : "info",
    changeOrigin: true,
    onProxyReq: (proxyReq, req, _res) => {
      // Add the Bearer token to the request if it is not already present, AND if
      // the token is part of the request as a cookie
      if (req.cookies?.keycloak_cookie && !req.headers.authorization) {
        proxyReq.setHeader("Authorization", `Bearer ${req.cookies.keycloak_cookie}`);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      const includesJsonHeaders = req.headers.accept?.includes("application/json");
      if (
        (!includesJsonHeaders && proxyRes.statusCode === 401) ||
        (!includesJsonHeaders && proxyRes.statusMessage === "Unauthorized")
      ) {
        res.redirect("/");
      }
    },
  },
};
