import { DataList } from "@patternfly/react-core";
import { ArtifactSignature } from "./ArtifactSignature";
import type { SignatureViewUI } from "@app/queries/artifacts.view-model";

export const ArtifactSignatures = ({ signatures }: { signatures: SignatureViewUI[] }) => {
  return (
    <DataList aria-label="Signatures list">
      {signatures?.map((signature: SignatureViewUI) => (
        <ArtifactSignature signature={signature} key={signature.digest} />
      ))}
    </DataList>
  );
};
