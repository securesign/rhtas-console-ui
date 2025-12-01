import { ArtifactAttestation } from "./ArtifactAttestation";
import { DataList } from "@patternfly/react-core";
import type { AttestationView } from "@app/client";

interface IArtifactAttestationsProps {
  attestations: AttestationView[];
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
