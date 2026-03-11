import { dump } from "js-yaml";
import { type DSSEV001Schema } from "rekor";
import { decodex509 } from "../utils/x509/decode";

export function DSSEPublicKey({ dsse }: { dsse: DSSEV001Schema }) {
  const sig = dsse.signatures?.[0];
  const certContent = window.atob(sig?.verifier ?? "");

  const publicKey = {
    title: "Public Key",
    content: certContent,
  };
  if (certContent.includes("BEGIN CERTIFICATE")) {
    publicKey.title = "Public Key Certificate";
    publicKey.content = dump(decodex509(certContent), {
      noArrayIndent: true,
      lineWidth: -1,
    });
  }

  return <>{publicKey.content}</>;
}

export function DSSEHash({ dsse }: { dsse: DSSEV001Schema }) {
  return <>{`${dsse.payloadHash?.algorithm}:${dsse.payloadHash?.value}`}</>;
}

export function DSSESignature({ dsse }: { dsse: DSSEV001Schema }) {
  const sig = dsse.signatures?.[0];
  return <>{sig?.signature ?? ""}</>;
}
