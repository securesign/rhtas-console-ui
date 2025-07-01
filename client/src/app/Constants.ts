import ENV from "./env";

export const isAuthRequired = ENV.AUTH_REQUIRED !== "false";
