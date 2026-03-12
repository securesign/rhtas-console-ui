import type { DSSEV001Schema, IntotoV002Schema, RekorSchema } from "rekor";
import { HashedRekordSignature } from "./HashedRekord";
import { IntotoViewer001Signature } from "./Intoto001";
import { IntotoViewer002Signature } from "./Intoto002";
import { DSSESignature } from "./DSSE";

export function Signature({ type, spec, apiVersion }: { type: string; apiVersion: string; spec: unknown }) {
  switch (type) {
    case "hashedrekord":
    case "rekord":
      return <HashedRekordSignature hashedRekord={spec as RekorSchema} />;
    case "intoto":
      if (apiVersion == "0.0.1") {
        return <IntotoViewer001Signature />;
      } else {
        return <IntotoViewer002Signature intoto={spec as IntotoV002Schema} />;
      }
    case "dsse":
      return <DSSESignature dsse={spec as DSSEV001Schema} />;
    default:
      return <div>Unsupported type: {type}</div>;
  }
}
