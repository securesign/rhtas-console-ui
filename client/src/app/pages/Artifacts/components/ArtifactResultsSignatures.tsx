import { DataList } from "@patternfly/react-core";
import { ArtifactSignatureItem } from "./ArtifactSignatureItem";
import type { Signatures } from "@app/client";

export const ArtifactResultsSignatures = ({ signatures }: { signatures?: Signatures }) => {
  return (
    <DataList aria-label="Signatures list" isCompact>
      {signatures?.map((signature) => (
        <ArtifactSignatureItem signature={signature} key={signature.signature.toString()} />
      ))}
    </DataList>
  );
};
