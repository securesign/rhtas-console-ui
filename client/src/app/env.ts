import { buildConsoleEnv, decodeEnv } from "@console-ui/common";

export const ENV = buildConsoleEnv(decodeEnv(window._env));

export default ENV;
