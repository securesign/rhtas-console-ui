import { DataList } from "@patternfly/react-core";
import { ArtifactSignatureItem } from "./ArtifactSignatureItem";
import type { Signatures } from "@app/client";

export const ArtifactResultsSignatures = ({ signatures }: { signatures?: Signatures }) => {
  console.table(signatures);
  return (
    <DataList aria-label="Signatures list" isCompact>
      {signatures?.map((signature, id) => (
        <ArtifactSignatureItem signature={signature} key={id} />
      ))}
    </DataList>
  );
};
