import type { DSSEV001Schema, IntotoV001Schema, IntotoV002Schema, RekorSchema } from "rekor";
import { HashedRekordHash } from "./HashedRekord";
import { IntotoViewer001Hash } from "./Intoto001";
import { IntotoViewer002Hash } from "./Intoto002";
import { DSSEHash } from "./DSSE";

export function Hash({
  type,
  spec,
  apiVersion,
  variant = "default",
}: {
  type: string;
  apiVersion: string;
  spec: unknown;
  variant?: "default" | "short";
}) {
  switch (type) {
    case "hashedrekord":
    case "rekord":
      return <HashedRekordHash variant={variant} hashedRekord={spec as RekorSchema} />;
    case "intoto":
      if (apiVersion == "0.0.1") {
        return <IntotoViewer001Hash variant={variant} intoto={spec as IntotoV001Schema} />;
      } else {
        return <IntotoViewer002Hash variant={variant} intoto={spec as IntotoV002Schema} />;
      }
    case "dsse":
      return <DSSEHash variant={variant} dsse={spec as DSSEV001Schema} />;
    default:
      return <div>Unsupported type: {type}</div>;
  }
}
