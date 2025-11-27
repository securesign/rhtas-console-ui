import type { AttestationView } from "@app/queries/artifacts.view-model";
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
import { relativeDateString } from "@app/utils/utils";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { CertificateChain } from "./CertificateChain";
import { LeafCertificate } from "./LeafCertificate";

export const ArtifactAttestation = ({ attestation }: { attestation: AttestationView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionsOpened, setActionsOpened] = useState(false);

  const handleToggleAttestationItem = () => {
    setIsExpanded(!isExpanded);
  };
  const handleToggleActions = () => setActionsOpened(!isActionsOpened);

  const handleActionSelect = () => {
    // TODO: probably some logic there
    setActionsOpened(false);
  };

  const key = attestation.digest.value.toString();

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
              <span id={`att-identity-${key}`}>{attestation.subject ?? "Unknown subject"}</span>
            </DataListCell>,
            <DataListCell key="digest">
              <ClipboardCopy
                truncation={{ maxCharsDisplayed: 14 }}
                hoverTip="Copy"
                clickTip="Copied"
                variant="inline-compact"
                isCode
              >
                {`${attestation.digest.algorithm}:${attestation.digest.value}`}
              </ClipboardCopy>
            </DataListCell>,
            <DataListCell key="attestationType">
              {attestation.predicateType ?? attestation.kind ?? "Unknown"}
            </DataListCell>,
            <DataListCell key="timestamp">
              {attestation.timestamp ? (
                <Timestamp
                  tooltip={{ variant: TimestampTooltipVariant.default }}
                  date={new Date(attestation.timestamp)}
                >
                  {relativeDateString(new Date(attestation.timestamp))}
                </Timestamp>
              ) : (
                "N/A"
              )}
            </DataListCell>,
            <DataListCell style={{ whiteSpace: "nowrap" }} key="verificationStatus">
              {`${attestation.status.verified ? "Attestation ✓" : "Attestation ✗"} / ${
                attestation.status.rekor === "present" ? "Rekor ✓" : "Rekor ✗"
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
              <DropdownItem key="download bundle" isDisabled>
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
              <CertificateChain certificateChain={attestation.certificateChain} />
            </StackItem>
          )}
          {attestation.rekorEntry && (
            <StackItem>
              {/** REKOR ENTRY */}
              <RekorEntryPanel rekorEntry={attestation.rekorEntry} />
            </StackItem>
          )}
        </Stack>
      </DataListContent>
    </DataListItem>
  );
};
