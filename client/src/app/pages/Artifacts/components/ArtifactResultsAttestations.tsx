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

export const ArtifactResultsAttestations = ({ attestations }: { attestations?: string[] }) => {
  console.table(attestations);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggleAttestationItem = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <DataList aria-label="Attestations list" isCompact>
      {attestations?.map((attestation, idx) => {
        const isExpanded = expandedIndex === idx;
        return (
          <DataListItem aria-labelledby={`att-item-${idx}`} key={`att-${idx}`} isExpanded={isExpanded}>
            <DataListItemRow>
              <DataListToggle
                onClick={() => handleToggleAttestationItem(idx)}
                isExpanded={isExpanded}
                id={`att-toggle-${idx}`}
                aria-controls={`att-expand-${idx}`}
              />
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="identity">
                    <span id="compact-item1">ryordan@redhat.com</span>
                  </DataListCell>,
                  <DataListCell key="digest">
                    <ClipboardCopy hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
                      sha256:77db
                    </ClipboardCopy>
                  </DataListCell>,
                  <DataListCell key="signatureType">DSSE</DataListCell>,
                  <DataListCell key="integratedTime">4 months ago </DataListCell>,
                  <DataListCell key="verificationStatus">Signature ✓ / Rekor ✓ / Chain ✓</DataListCell>,
                ]}
              />
            </DataListItemRow>
            <DataListContent
              aria-label="Attestation expandable content details"
              id={`att-expand-${idx}`}
              isHidden={!isExpanded}
            >
              <Panel>
                <Content component={ContentVariants.h6} style={{ margin: "1em auto" }}>
                  Attestation
                </Content>
              </Panel>
            </DataListContent>
          </DataListItem>
        );
      })}
    </DataList>
  );
};
