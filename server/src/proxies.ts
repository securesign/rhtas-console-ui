import { CONSOLE_ENV } from "@console-ui/common";
import * as cookie from "cookie";
import type { Options } from "http-proxy-middleware";

export const proxyMap: Record<string, Options> = {
  "/api": {
    target: CONSOLE_ENV.CONSOLE_API_URL ?? "http://localhost:8080",
    logger: process.env.DEBUG ? "debug" : "info",
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, _res) => {
        // Add the Bearer token to the request if it is not already present, AND if
        // the token is part of the request as a cookie
        const cookies = cookie.parse(req.headers.cookie ?? "");
        const bearerToken = cookies.keycloak_cookie;
        if (bearerToken && !req.headers["authorization"]) {
          proxyReq.setHeader("Authorization", `Bearer ${bearerToken}`);
        }
      },
      proxyRes: (proxyRes, req, res) => {
        if (
          !req.headers.accept?.includes("application/json") &&
          (proxyRes.statusCode === 401 || proxyRes.statusMessage === "Unauthorized")
        ) {
          res.writeHead(302, { Location: "/" }).end();
          proxyRes?.destroy();
        }
      }
    }
  },
};
