import fs from "node:fs";
import https from "node:https";
import path from "node:path";

import type { Options } from "http-proxy-middleware";

import { CONSOLE_ENV } from "@console-ui/common";

const logger =
  process.env.DEBUG === "1"
    ? console
    : {
        info() {},
        warn: console.warn,
        error: console.error,
      };

const apiUrl = CONSOLE_ENV.CONSOLE_API_URL ?? "http://localhost:8080";
const proxyConfig: Options = {
  pathFilter: "/api",
  target: apiUrl,
  logger,
  changeOrigin: true,
};

if (apiUrl.startsWith("https://")) {
  const sslCertDir = process.env.SSL_CERT_DIR;

  if (sslCertDir && sslCertDir.trim()) {
    const caPaths = sslCertDir.split(":");
    const cas: Buffer[] = [];

    for (const dir of caPaths) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith(".crt") || file.endsWith(".pem")) {
            const certPath = path.join(dir, file);
            try {
              const cert = fs.readFileSync(certPath);
              cas.push(cert);
              logger.info(`Loaded CA certificate from ${certPath}`);
            } catch (error: unknown) {
              logger.warn(`Failed to load certificate ${certPath}: ${(error as NodeJS.ErrnoException).message}`);
            }
          }
        }
      } catch (error: unknown) {
        const nodeError = error as NodeJS.ErrnoException;
        if (nodeError.code === "ENOTDIR" || nodeError.code === "ENOENT") {
          try {
            const cert = fs.readFileSync(dir);
            cas.push(cert);
            logger.info(`Loaded CA certificate from ${dir}`);
          } catch (readError: unknown) {
            logger.warn(`Failed to load CAs from ${dir}: ${(readError as NodeJS.ErrnoException).message}`);
          }
        } else {
          logger.warn(`Failed to read directory ${dir}: ${nodeError.message}`);
        }
      }
    }

    if (cas.length > 0) {
      proxyConfig.agent = new https.Agent({ ca: cas, keepAlive: true });
      logger.info(`Configured HTTPS proxy with ${cas.length} CA certificate(s)`);
    } else {
      logger.info(`No CA certificates found in SSL_CERT_DIR, using system trust store`);
    }
  } else {
    logger.info(`HTTPS backend detected but SSL_CERT_DIR not set, using system trust store`);
  }
}

export const proxyMap: Record<string, Options> = {
  api: proxyConfig,
};
