import { DataList } from "@patternfly/react-core";
import { ArtifactSignatureItem } from "./ArtifactSignatureItem";
import type { SignatureView } from "@app/queries/artifacts";

export const ArtifactResultsSignatures = ({ signatures }: { signatures?: SignatureView[] }) => {
  return (
    <DataList aria-label="Signatures list" isCompact>
      {signatures?.map((signature: SignatureView) => (
        <ArtifactSignatureItem signature={signature} key={signature.hash.value.toString()} />
      ))}
    </DataList>
  );
};
