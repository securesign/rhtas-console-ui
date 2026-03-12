import { dump } from "js-yaml";
import { type DSSEV001Schema } from "rekor";
import { decodex509, getShortCommitHash, hasValidPublicCertificate } from "../utils/x509/decode";
import PublicKeyValidity from "./PublicKeyValidity";

export function DSSEPublicKey({
  dsse,
  variant = "content",
}: {
  dsse: DSSEV001Schema;
  variant?: "content" | "validity";
}) {
  const sig = dsse.signatures?.[0];
  const certContent = window.atob(sig?.verifier ?? "");

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

export function DSSEHash({ dsse, variant = "default" }: { dsse: DSSEV001Schema; variant?: "default" | "short" }) {
  const commitHash = `${dsse.payloadHash?.algorithm}:${dsse.payloadHash?.value}`;
  return <>{variant === "short" ? getShortCommitHash(commitHash) : commitHash}</>;
}

export function DSSESignature({ dsse }: { dsse: DSSEV001Schema }) {
  const sig = dsse.signatures?.[0];
  return <>{sig?.signature ?? ""}</>;
}
