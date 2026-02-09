import {
  ClipboardCopy,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Stack,
  StackItem,
  Timestamp,
  TimestampTooltipVariant,
  Truncate,
  type MenuToggleElement,
} from "@patternfly/react-core";
import { Fragment, useState } from "react";
import { RekorEntryPanel } from "./RekorEntryPanel";
import { handleDownloadBundle, relativeDateString } from "@app/utils/utils";
import { EllipsisVIcon, CheckIcon, TimesIcon } from "@patternfly/react-icons";
import { CertificateChain } from "./CertificateChain";
import { LeafCertificate } from "./LeafCertificate";
import type { AttestationView } from "@app/client";
import { Tr, Td, ExpandableRowContent } from "@patternfly/react-table";
interface IArtifactAttestation {
  attestation: AttestationView;
  index: number;
}

export const ArtifactAttestation = ({ attestation, index }: IArtifactAttestation) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActionsOpened, setActionsOpened] = useState(false);

  const handleToggleAttestationItem = () => {
    setIsExpanded(!isExpanded);
  };
  const handleToggleActions = () => setActionsOpened(!isActionsOpened);

  const handleActionSelect = () => {
    setActionsOpened(false);
  };
  const attestationStatusBadge =
    attestation.attestationStatus.attestation === "verified" ? <CheckIcon /> : <TimesIcon />;
  const rekorStatusBadge = attestation.attestationStatus.rekor === "verified" ? <CheckIcon /> : <TimesIcon />;
  const key = attestation.digest;

  return (
    <Fragment>
      <Tr aria-labelledby={`attestation-item-${key}`} isContentExpanded={isExpanded}>
        <Td
          id={`attestation-toggle-${key}`}
          aria-controls={`attestation-expand-${key}`}
          expand={{
            rowIndex: index,
            isExpanded,
            onToggle: () => handleToggleAttestationItem(),
          }}
        />
        <Td key="identity">
          <span id={`att-identity-${key}`}>
            <Truncate
              maxCharsDisplayed={20}
              content={attestation.signingCertificate?.sans.join(", ") ?? "Unknown subject"}
            />
          </span>
        </Td>
        <Td key="digest">
          <ClipboardCopy
            truncation={{ maxCharsDisplayed: 14 }}
            hoverTip="Copy"
            clickTip="Copied"
            variant="inline-compact"
            isCode
          >
            {`${attestation.digest}`}
          </ClipboardCopy>
        </Td>
        <Td key="attestationType">{attestation.predicateType ?? "Unknown"}</Td>
        <Td key="timestamp">
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
        </Td>
        <Td key="verificationStatusForAttestation">{attestationStatusBadge}</Td>
        <Td key="verificationStatusForRekor">{rekorStatusBadge}</Td>
        <Td>
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
        </Td>
      </Tr>
      <Tr aria-label="Attestation expandable content details" id={`attestation-expand-${key}`} isHidden={!isExpanded}>
        <Td colSpan={8}>
          <ExpandableRowContent>
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
          </ExpandableRowContent>
        </Td>
      </Tr>
    </Fragment>
  );
};
