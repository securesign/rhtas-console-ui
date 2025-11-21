import { DataList } from "@patternfly/react-core";
import { ArtifactSignature } from "./ArtifactSignature";
import type { SignatureView } from "@app/queries/artifacts.view-model";

export const ArtifactSignatures = ({ signatures }: { signatures?: SignatureView[] }) => {
  return (
    <DataList aria-label="Signatures list">
      {signatures?.map((signature: SignatureView) => (
        <ArtifactSignature signature={signature} key={signature.hash.value.toString()} />
      ))}
    </DataList>
  );
};
