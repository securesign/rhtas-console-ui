import { getHash, getShortCommitHash } from "../utils/spec";

export function Hash({
  type,
  spec,
  variant = "default",
}: {
  type: string;
  spec: unknown;
  variant?: "default" | "short";
}) {
  const commitHash = getHash({ type, spec });
  if (!commitHash) return <div>Unsupported type</div>;
  return <>{variant === "short" ? getShortCommitHash(commitHash) : commitHash}</>;
}
