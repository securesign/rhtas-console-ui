import ENV from "./env";

export const isAuthRequired = ENV.AUTH_REQUIRED !== "false";

export const RENDER_DATE_FORMAT = "MMM DD, YYYY";

/**
 * The name of the client generated id field inserted in a object marked with mixin type
 * `WithUiId`.
 */
export const UI_UNIQUE_ID = "_ui_unique_id";
