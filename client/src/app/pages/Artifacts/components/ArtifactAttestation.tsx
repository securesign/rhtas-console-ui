import {
  ClipboardCopy,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Stack,
  StackItem,
  Timestamp,
  TimestampTooltipVariant,
  type MenuToggleElement,
} from "@patternfly/react-core";
import { useState } from "react";
import { RekorEntryPanel } from "./RekorEntryPanel";
import { handleDownloadBundle, relativeDateString } from "@app/utils/utils";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { CertificateChain } from "./CertificateChain";
import { LeafCertificate } from "./LeafCertificate";
import type { AttestationView } from "@app/client";

interface IArtifactAttestation {
  attestation: AttestationView;
}

export const ArtifactAttestation = ({ attestation }: IArtifactAttestation) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionsOpened, setActionsOpened] = useState(false);

  const handleToggleAttestationItem = () => {
    setIsExpanded(!isExpanded);
  };
  const handleToggleActions = () => setActionsOpened(!isActionsOpened);

  const handleActionSelect = () => {
    setActionsOpened(false);
  };

  const key = attestation.digest;

  return (
    <DataListItem aria-labelledby={`attestation-item-${key}`} isExpanded={isExpanded}>
      <DataListItemRow>
        <DataListToggle
          onClick={handleToggleAttestationItem}
          isExpanded={isExpanded}
          id={`attestation-toggle-${key}`}
          aria-controls={`attestation-expand-${key}`}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key="identity">
              <span id={`att-identity-${key}`}>
                {attestation.signingCertificate?.sans.join(", ") ?? "Unknown subject"}
              </span>
            </DataListCell>,
            <DataListCell key="digest">
              <ClipboardCopy
                truncation={{ maxCharsDisplayed: 14 }}
                hoverTip="Copy"
                clickTip="Copied"
                variant="inline-compact"
                isCode
              >
                {`${attestation.digest}`}
              </ClipboardCopy>
            </DataListCell>,
            <DataListCell key="attestationType">{attestation.predicateType ?? "Unknown"}</DataListCell>,
            <DataListCell key="timestamp">
              {typeof attestation.timestamp === "string"
                ? (() => {
                    const date = new Date(attestation.timestamp);
                    return (
                      <Timestamp tooltip={{ variant: TimestampTooltipVariant.default }} date={date}>
                        {relativeDateString(date)}
                      </Timestamp>
                    );
                  })()
                : "N/A"}
            </DataListCell>,
            <DataListCell style={{ whiteSpace: "nowrap" }} key="verificationStatus">
              {`${attestation.attestationStatus.attestation === "verified" ? "Attestation ✓" : "Attestation ✗"} / ${
                attestation.attestationStatus.rekor === "verified" ? "Rekor ✓" : "Rekor ✗"
              }`}
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-labelledby={`attestation-item-${key} attestation-action-${key}`}
          id={`attestation-action-${key}`}
          aria-label="Actions"
        >
          <Dropdown
            popperProps={{ position: "right" }}
            onSelect={handleActionSelect}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                size="sm"
                ref={toggleRef}
                isExpanded={isActionsOpened}
                onClick={handleToggleActions}
                variant="plain"
                aria-label="Attestation actions"
                icon={<EllipsisVIcon />}
              />
            )}
            isOpen={isActionsOpened}
            onOpenChange={setActionsOpened}
          >
            <DropdownList>
              <DropdownItem
                key="download bundle"
                onClick={() => handleDownloadBundle(attestation)}
                isDisabled={!attestation.rawBundleJson}
              >
                Download Bundle
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </DataListAction>
      </DataListItemRow>
      <DataListContent
        aria-label="Attestation expandable content details"
        id={`attestation-expand-${key}`}
        isHidden={!isExpanded}
      >
        <Stack hasGutter>
          {attestation.signingCertificate && (
            <StackItem>
              {/** LEAF / SIGNING CERTIFICATE */}
              <LeafCertificate leafCert={attestation.signingCertificate} />
            </StackItem>
          )}
          {attestation.certificateChain && attestation.certificateChain.length > 0 && (
            <StackItem>
              {/** CERTIFICATE CHAIN (INTERMEDIATE + ROOT) */}
              <CertificateChain
                certificateChain={attestation.certificateChain}
                status={attestation.attestationStatus.chain}
              />
            </StackItem>
          )}
          {attestation.rekorEntry && (
            <StackItem>
              {/** REKOR ENTRY */}
              <RekorEntryPanel rekorEntry={attestation.rekorEntry} status={attestation.attestationStatus.rekor} />
            </StackItem>
          )}
        </Stack>
      </DataListContent>
    </DataListItem>
  );
};
