import { CONSOLE_ENV } from "@console-ui/common";
import * as cookie from "cookie";

/** @type Logger */
const logger =
  process.env.DEBUG === "1"
    ? console
    : {
        info() {},
        warn: console.warn,
        error: console.error,
      };

export default {
  api: {
    pathFilter: "/api",
    target: CONSOLE_ENV.CONSOLE_API_URL ?? "http://localhost:8080",
    logger,
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
      },
    },
  },
};
