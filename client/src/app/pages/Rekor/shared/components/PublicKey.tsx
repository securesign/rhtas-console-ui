import { getPublicKeyContent, isPublicKeyValid } from "../utils/spec";
import PublicKeyValidity from "./PublicKeyValidity";

export function PublicKey({
  type,
  spec,
  apiVersion,
  variant = "content",
  integratedTime,
}: {
  type: string;
  apiVersion: string;
  spec: unknown;
  variant?: "content" | "validity";
  integratedTime?: number;
}) {
  if (variant === "validity") {
    return <PublicKeyValidity isValid={isPublicKeyValid({ type, spec, apiVersion }, integratedTime)} />;
  }

  const content = getPublicKeyContent({ type, spec, apiVersion });
  if (content == null) return <div>Unsupported type: {type}</div>;

  return <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{content}</div>;
}
