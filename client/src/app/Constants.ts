import ENV from "./env";

export const isAuthRequired = ENV.AUTH_REQUIRED !== "false";

export const RENDER_DATE_FORMAT = "MMM DD, YYYY";
