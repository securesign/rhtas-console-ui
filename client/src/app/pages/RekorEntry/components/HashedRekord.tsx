import { dump } from "js-yaml";
import { type RekorSchema } from "rekor";
import { decodex509 } from "../utils/x509/decode";

export function HashedRekordPublicKey({ hashedRekord }: { hashedRekord: RekorSchema }) {
  const certContent = window.atob(hashedRekord.signature.publicKey?.content ?? "");

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

export function HashedRekordHash({ hashedRekord }: { hashedRekord: RekorSchema }) {
  return <>{`${hashedRekord.data.hash?.algorithm}:${hashedRekord.data.hash?.value}`}</>;
}

export function HashedRekordSignature({ hashedRekord }: { hashedRekord: RekorSchema }) {
  return <>{hashedRekord.signature.content ?? ""}</>;
}
