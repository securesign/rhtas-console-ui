import { dump } from "js-yaml";
import type { DSSEV001Schema, IntotoV001Schema, IntotoV002Schema, RekorSchema } from "rekor";
import { decodex509, hasValidPublicCertificate } from "./x509/decode";

interface SpecInput {
  type: string;
  spec: unknown;
  apiVersion?: string;
}

export function getHash({ type, spec }: SpecInput): string | null {
  switch (type) {
    case "hashedrekord":
    case "rekord": {
      const s = spec as RekorSchema;
      return `${s.data.hash?.algorithm}:${s.data.hash?.value}`;
    }
    case "intoto": {
      const s = spec as IntotoV001Schema | IntotoV002Schema;
      return `${s.content.payloadHash?.algorithm}:${s.content.payloadHash?.value}`;
    }
    case "dsse": {
      const s = spec as DSSEV001Schema;
      return `${s.payloadHash?.algorithm}:${s.payloadHash?.value}`;
    }
    default:
      return null;
  }
}

export function getShortCommitHash(hash: string): string {
  if (hash === "-") {
    return "-";
  }
  const hashValue = hash.includes(":") ? hash.split(":")[1] : hash;
  return hashValue.slice(0, 7);
}

export function getSignature({ type, spec, apiVersion }: SpecInput): string | null {
  switch (type) {
    case "hashedrekord":
    case "rekord": {
      const s = spec as RekorSchema;
      return s.signature.content ?? "";
    }
    case "intoto": {
      if (apiVersion === "0.0.1") {
        return "Missing for intoto v0.0.1 entries";
      }
      const s = spec as IntotoV002Schema;
      const signature = s.content.envelope?.signatures[0];
      return window.atob(signature?.sig || "");
    }
    case "dsse": {
      const s = spec as DSSEV001Schema;
      const sig = s.signatures?.[0];
      return sig?.signature ?? "";
    }
    default:
      return null;
  }
}

function getRawPublicKeyCert({ type, spec, apiVersion }: SpecInput): string | null {
  switch (type) {
    case "hashedrekord":
    case "rekord": {
      const s = spec as RekorSchema;
      return window.atob(s.signature.publicKey?.content ?? "");
    }
    case "intoto": {
      if (apiVersion === "0.0.1") {
        const s = spec as IntotoV001Schema;
        return window.atob(s.publicKey || "");
      }
      const s = spec as IntotoV002Schema;
      const signature = s.content.envelope?.signatures[0];
      return window.atob(signature?.publicKey || "");
    }
    case "dsse": {
      const s = spec as DSSEV001Schema;
      const sig = s.signatures?.[0];
      return window.atob(sig?.verifier ?? "");
    }
    default:
      return null;
  }
}

export function getPublicKeyContent(input: SpecInput): string | null {
  const certContent = getRawPublicKeyCert(input);
  if (certContent == null) return null;

  if (certContent.includes("BEGIN CERTIFICATE")) {
    return dump(decodex509(certContent), {
      noArrayIndent: true,
      lineWidth: -1,
    });
  }
  return certContent;
}

export function isPublicKeyValid(input: SpecInput, integratedTime?: number): boolean {
  const certContent = getRawPublicKeyCert(input);
  if (certContent == null) return false;
  return hasValidPublicCertificate(certContent, integratedTime);
}
