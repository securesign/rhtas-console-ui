import { dump } from "js-yaml";
import { type IntotoV002Schema } from "rekor";
import { decodex509, getShortCommitHash, hasValidPublicCertificate } from "../utils/x509/decode";
import PublicKeyValidity from "./PublicKeyValidity";

export function IntotoViewer002Publickey({
  intoto,
  variant = "content",
}: {
  intoto: IntotoV002Schema;
  variant?: "content" | "validity";
}) {
  const signature = intoto.content.envelope?.signatures[0];
  const certContent = window.atob(signature?.publicKey || "");

  if (variant === "validity") return <PublicKeyValidity isValid={hasValidPublicCertificate(certContent)} />;

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

export function IntotoViewer002Hash({
  intoto,
  variant = "default",
}: {
  intoto: IntotoV002Schema;
  variant?: "default" | "short";
}) {
  const commitHash = `${intoto.content.payloadHash?.algorithm}:${intoto.content.payloadHash?.value}`;
  return <>{variant === "short" ? getShortCommitHash(commitHash) : commitHash}</>;
}

export function IntotoViewer002Signature({ intoto }: { intoto: IntotoV002Schema }) {
  const signature = intoto.content.envelope?.signatures[0];
  return <>{window.atob(signature?.sig || "")}</>;
}
