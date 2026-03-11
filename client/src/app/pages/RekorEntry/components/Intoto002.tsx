import { dump } from "js-yaml";
import { type IntotoV002Schema } from "rekor";
import { decodex509 } from "../utils/x509/decode";

export function IntotoViewer002Publickey({ intoto }: { intoto: IntotoV002Schema }) {
  const signature = intoto.content.envelope?.signatures[0];
  const certContent = window.atob(signature?.publicKey || "");

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

export function IntotoViewer002Hash({ intoto }: { intoto: IntotoV002Schema }) {
  return <>{`${intoto.content.payloadHash?.algorithm}:${intoto.content.payloadHash?.value}`}</>;
}

export function IntotoViewer002Signature({ intoto }: { intoto: IntotoV002Schema }) {
  const signature = intoto.content.envelope?.signatures[0];
  return <>{window.atob(signature?.sig || "")}</>;
}
