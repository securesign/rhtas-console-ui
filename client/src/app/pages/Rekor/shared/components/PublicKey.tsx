import type { DSSEV001Schema, IntotoV001Schema, IntotoV002Schema, RekorSchema } from "rekor";
import { HashedRekordPublicKey } from "./HashedRekord";
import { IntotoViewer001PublicKey } from "./Intoto001";
import { IntotoViewer002Publickey } from "./Intoto002";
import { DSSEPublicKey } from "./DSSE";

export function PublicKey({
  type,
  spec,
  apiVersion,
  variant = "content",
}: {
  type: string;
  apiVersion: string;
  spec: unknown;
  variant?: "content" | "validity";
}) {
  let content;
  switch (type) {
    case "hashedrekord":
    case "rekord":
      content = <HashedRekordPublicKey variant={variant} hashedRekord={spec as RekorSchema} />;
      break;
    case "intoto":
      if (apiVersion == "0.0.1") {
        content = <IntotoViewer001PublicKey variant={variant} intoto={spec as IntotoV001Schema} />;
        break;
      } else {
        content = <IntotoViewer002Publickey variant={variant} intoto={spec as IntotoV002Schema} />;
        break;
      }
    case "dsse":
      content = <DSSEPublicKey variant={variant} dsse={spec as DSSEV001Schema} />;
      break;
    default:
      return <div>Unsupported type: {type}</div>;
  }

  return <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{content}</div>;
}
