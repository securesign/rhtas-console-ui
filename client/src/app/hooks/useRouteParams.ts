import { useParams } from "react-router-dom";

export const useRouteParams = (pathParam: "logIndex") => {
  const params = useParams();
  const value = params[pathParam];
  if (value === undefined) {
    throw new Error(`ASSERTION FAILURE: required path parameter not set: ${pathParam}`);
  }
  return value;
};
