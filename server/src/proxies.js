import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { CONSOLE_ENV } from "@console-ui/common";

/** @type Logger */
const logger =
  process.env.DEBUG === "1"
    ? console
    : {
        info() {},
        warn: console.warn,
        error: console.error,
      };

// Configure HTTPS agent for proxying to backend API with TLS
const apiUrl = CONSOLE_ENV.CONSOLE_API_URL ?? "http://localhost:8080";
let proxyConfig = {
  pathFilter: "/api",
  target: apiUrl,
  logger,
  changeOrigin: true,
};

// When backend uses HTTPS, load CA certificates from SSL_CERT_DIR
if (apiUrl.startsWith("https://")) {
  const sslCertDir = process.env.SSL_CERT_DIR;

  if (sslCertDir) {
    const caPaths = sslCertDir.split(":");
    const cas = [];

    for (const dir of caPaths) {
      // Try to read as directory first
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith(".crt") || file.endsWith(".pem")) {
            const certPath = path.join(dir, file);
            try {
              const cert = fs.readFileSync(certPath);
              cas.push(cert);
              logger.info(`Loaded CA certificate from ${certPath}`);
            } catch (error) {
              logger.warn(`Failed to load certificate ${certPath}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        // If not a directory, try to read as a single file
        if (error.code === "ENOTDIR" || error.code === "ENOENT") {
          try {
            const cert = fs.readFileSync(dir);
            cas.push(cert);
            logger.info(`Loaded CA certificate from ${dir}`);
          } catch (readError) {
            logger.warn(`Failed to load CAs from ${dir}: ${readError.message}`);
          }
        } else {
          logger.warn(`Failed to read directory ${dir}: ${error.message}`);
        }
      }
    }

    if (cas.length > 0) {
      proxyConfig.agent = new https.Agent({ ca: cas });
      logger.info(`Configured HTTPS proxy with ${cas.length} CA certificate(s)`);
    } else {
      logger.info(`No CA certificates found in SSL_CERT_DIR, using system trust store`);
    }
  } else {
    logger.info(`HTTPS backend detected but SSL_CERT_DIR not set, using system trust store`);
  }
}

export default {
  api: proxyConfig,
};
