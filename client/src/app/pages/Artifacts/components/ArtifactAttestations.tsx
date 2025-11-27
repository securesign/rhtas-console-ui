import type { AttestationView } from "@app/queries/artifacts.view-model";
import { ArtifactAttestation } from "./ArtifactAttestation";
import { DataList } from "@patternfly/react-core";

interface IArtifactAttestationsProps {
  attestations: AttestationView[];
}

export const ArtifactAttestations = ({ attestations }: IArtifactAttestationsProps) => {
  return (
    <DataList aria-label="Artifact attestations list">
      {attestations.map((attestation) => (
        <ArtifactAttestation attestation={attestation} key={attestation.digest.value.toString()} />
      ))}
    </DataList>
  );
};
