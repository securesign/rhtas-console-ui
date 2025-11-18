import type { AttestationView } from "@app/queries/artifacts";
import {
  ClipboardCopy,
  Content,
  ContentVariants,
  DataList,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Panel,
} from "@patternfly/react-core";
import { useState } from "react";

interface ArtifactResultsAttestationsProps {
  attestations: AttestationView[];
}

export const ArtifactResultsAttestations = ({ attestations }: ArtifactResultsAttestationsProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const onToggle = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <DataList aria-label="Artifact attestations list">
      {attestations.map((attestation, idx) => {
        const isExpanded = expandedIndex === idx;
        return (
          <DataListItem key={idx} aria-labelledby={`attestation-item-${idx}`} isExpanded={isExpanded}>
            <DataListItemRow>
              <DataListToggle
                onClick={() => onToggle(idx)}
                isExpanded={isExpanded}
                id={`attestation-toggle-${idx}`}
                aria-controls={`attestation-expand-${idx}`}
              />
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="identity">
                    <span id={`att-identity-${idx}`}>{attestation.subject ?? "Unknown subject"}</span>
                  </DataListCell>,
                  <DataListCell key="digest">
                    <ClipboardCopy hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
                      {`${attestation.digest.algorithm}:${attestation.digest.value.slice(0, 8)}`}
                    </ClipboardCopy>
                  </DataListCell>,
                  <DataListCell key="attestationType">
                    {attestation.predicateType ?? attestation.kind ?? "Unknown"}
                  </DataListCell>,
                  <DataListCell key="timestamp">{attestation.timestamp ?? "Unknown time"}</DataListCell>,
                  <DataListCell key="verificationStatus">
                    {`${attestation.status.verified ? "Attestation ✓" : "Attestation ✗"} / ${
                      attestation.status.rekor === "present" ? "Rekor ✓" : "Rekor ✗"
                    }`}
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
            <DataListContent aria-label="Attestation details" id={`attestation-expand-${idx}`} isHidden={!isExpanded}>
              <Panel>
                <Content component={ContentVariants.small}>
                  <strong>Subject:</strong> {attestation.subject ?? "Unknown"}
                  <br />
                  <strong>Predicate type:</strong> {attestation.predicateType ?? "Unknown"}
                  <br />
                  <strong>Digest:</strong> {attestation.digest.algorithm}:{attestation.digest.value}
                  <br />
                  <strong>Rekor entry:</strong>{" "}
                  {attestation.rekorEntry
                    ? `Entry #${attestation.rekorEntry.logIndex} (UUID ${attestation.rekorEntry.uuid})`
                    : "No Rekor entry"}
                </Content>
              </Panel>
            </DataListContent>
          </DataListItem>
        );
      })}
    </DataList>
  );
};
