import { dump } from "js-yaml";
import { type IntotoV001Schema } from "rekor";
import { decodex509, getShortCommitHash, hasValidPublicCertificate } from "../utils/x509/decode";
import PublicKeyValidity from "./PublicKeyValidity";

export function IntotoViewer001PublicKey({
  intoto,
  variant = "content",
}: {
  intoto: IntotoV001Schema;
  variant?: "content" | "validity";
}) {
  const certContent = window.atob(intoto.publicKey || "");

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

export function IntotoViewer001Hash({
  intoto,
  variant = "default",
}: {
  intoto: IntotoV001Schema;
  variant?: "default" | "short";
}) {
  const commitHash = `${intoto.content.payloadHash?.algorithm}:${intoto.content.payloadHash?.value}`;
  return <>{variant === "short" ? getShortCommitHash(commitHash) : commitHash}</>;
}

export function IntotoViewer001Signature() {
  return "Missing for intoto v0.0.1 entries";
}
