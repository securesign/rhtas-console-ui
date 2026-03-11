import { dump } from "js-yaml";
import { type IntotoV001Schema } from "rekor";
import { decodex509 } from "../utils/x509/decode";

export function IntotoViewer001PublicKey({ intoto }: { intoto: IntotoV001Schema }) {
  const certContent = window.atob(intoto.publicKey || "");

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

export function IntotoViewer001Hash({ intoto }: { intoto: IntotoV001Schema }) {
  return <>{`${intoto.content.payloadHash?.algorithm}:${intoto.content.payloadHash?.value}`}</>;
}

export function IntotoViewer001Signature() {
  return "Missing for intoto v0.0.1 entries";
}
