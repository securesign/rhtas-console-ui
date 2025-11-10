import { DataList } from "@patternfly/react-core";
import { ArtifactSignatureItem } from "./ArtifactSignatureItem";

export const ArtifactResultsSignatures = ({ signatures }: { signatures: string[] }) => {
  console.table(signatures);

  return (
    <DataList aria-label="Signatures list" isCompact>
      {signatures.map((signature, id) => (
        <ArtifactSignatureItem signature={signature} key={id} />
      ))}
    </DataList>
  );
};
