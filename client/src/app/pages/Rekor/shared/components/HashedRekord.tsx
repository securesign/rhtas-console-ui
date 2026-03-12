import { dump } from "js-yaml";
import { type RekorSchema } from "rekor";
import { decodex509, getShortCommitHash, hasValidPublicCertificate } from "../utils/x509/decode";
import PublicKeyValidity from "./PublicKeyValidity";

export function HashedRekordPublicKey({
  hashedRekord,
  variant = "content",
}: {
  hashedRekord: RekorSchema;
  variant?: "content" | "validity";
}) {
  const certContent = window.atob(hashedRekord.signature.publicKey?.content ?? "");

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

export function HashedRekordHash({
  hashedRekord,
  variant = "default",
}: {
  hashedRekord: RekorSchema;
  variant?: "default" | "short";
}) {
  const commitHash = `${hashedRekord.data.hash?.algorithm}:${hashedRekord.data.hash?.value}`;
  return <>{variant === "short" ? getShortCommitHash(commitHash) : commitHash}</>;
}

export function HashedRekordSignature({ hashedRekord }: { hashedRekord: RekorSchema }) {
  return <>{hashedRekord.signature.content ?? ""}</>;
}
