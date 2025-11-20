import type { AttestationView } from "@app/queries/artifacts.view-model";
import { ArtifactAttestationItem } from "./ArtifactAttestationItem";
import { DataList } from "@patternfly/react-core";

interface ArtifactResultsAttestationsProps {
  attestations: AttestationView[];
}

export const ArtifactResultsAttestations = ({ attestations }: ArtifactResultsAttestationsProps) => {

  return (
    <DataList aria-label="Artifact attestations list" isCompact>
      {attestations.map((attestation) => <ArtifactAttestationItem attestation={attestation} key={attestation.digest.value.toString()} />)}
    </DataList>
  );
};
