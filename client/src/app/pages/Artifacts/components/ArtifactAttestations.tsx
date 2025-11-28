import { ArtifactAttestation } from "./ArtifactAttestation";
import { DataList } from "@patternfly/react-core";
import type { AttestationViewUI } from "@app/queries/artifacts.view-model";

interface IArtifactAttestationsProps {
  attestations: AttestationViewUI[];
}

export const ArtifactAttestations = ({ attestations }: IArtifactAttestationsProps) => {
  return (
    <DataList aria-label="Artifact attestations list">
      {attestations.map((attestation) => (
        <ArtifactAttestation attestation={attestation} key={attestation.digest} />
      ))}
    </DataList>
  );
};
