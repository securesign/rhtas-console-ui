import axios from "axios";

import { createClient } from "@app/client/client";

export const client = createClient({
  // set default base url for requests
  baseURL: "/",
  axios: axios,
  throwOnError: true,
});
