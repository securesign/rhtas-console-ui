import { getSignature } from "../utils/spec";

export function Signature({ type, spec, apiVersion }: { type: string; apiVersion: string; spec: unknown }) {
  const signature = getSignature({ type, spec, apiVersion });
  if (signature == null) return <div>Unsupported type: {type}</div>;
  return <>{signature}</>;
}
