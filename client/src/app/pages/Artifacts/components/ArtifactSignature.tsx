import {
  DataListItem,
  DataListItemRow,
  DataListToggle,
  DataListItemCells,
  DataListCell,
  ClipboardCopy,
  DataListAction,
  Dropdown,
  type MenuToggleElement,
  MenuToggle,
  DropdownList,
  DropdownItem,
  DataListContent,
  Timestamp,
  TimestampTooltipVariant,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useState } from "react";
import { handleDownloadBundle, relativeDateString, toIdentity } from "@app/utils/utils";
import { RekorEntryPanel } from "./RekorEntryPanel";
import { LeafCertificate } from "./LeafCertificate";
import { CertificateChain } from "./CertificateChain";
import type { RekorEntry, SignatureView } from "@app/client";

export const ArtifactSignature = ({ signature }: { signature: SignatureView }) => {
  const [isActionsOpened, setActionsOpened] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const key = signature.digest;

  const handleToggleSignatureItem = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleActions = () => setActionsOpened(!isActionsOpened);

  const handleActionSelect = () => {
    setActionsOpened(false);
  };

  const displayIdentity = toIdentity(signature.signingCertificate)?.san ?? "Unknown identity";
  const signatureStatusBadge = signature.signatureStatus.signature === "verified" ? "Signature ✓" : "Signature ✗";
  const rekorStatusBadge = signature.signatureStatus.rekor === "verified" ? "Rekor ✓" : "Rekor ✗";
  const chainStatusBadge = signature.signatureStatus.chain === "verified" ? "Chain ✓" : "Chain ✗";
  const verificationStatusDisplay = `${signatureStatusBadge} / ${chainStatusBadge} / ${rekorStatusBadge}`;

  return (
    <DataListItem aria-labelledby={`signature-item-${key}`} key={`${key}`} isExpanded={isExpanded}>
      <DataListItemRow>
        <DataListToggle
          onClick={handleToggleSignatureItem}
          isExpanded={isExpanded}
          id={`signature-toggle-${key}`}
          aria-controls={`sig-expand-${key}`}
        />
        {/** SIGNATURE OVERVIEW */}
        <DataListItemCells
          dataListCells={[
            <DataListCell key="identity">{displayIdentity}</DataListCell>,
            <DataListCell key="digest">
              <ClipboardCopy
                truncation={{ maxCharsDisplayed: 14 }}
                hoverTip="Copy signature SHA"
                clickTip="Copied"
                variant="inline-compact"
                isCode
              >
                {signature.digest}
              </ClipboardCopy>
            </DataListCell>,
            <DataListCell key="integratedTime">
              {typeof signature.timestamp === "string"
                ? (() => {
                    const date = new Date(signature.timestamp);
                    return (
                      <Timestamp tooltip={{ variant: TimestampTooltipVariant.default }} date={date}>
                        {relativeDateString(date)}
                      </Timestamp>
                    );
                  })()
                : "N/A"}
            </DataListCell>,
            <DataListCell style={{ whiteSpace: "nowrap" }} key="verificationStatus">
              {verificationStatusDisplay}
            </DataListCell>,
          ]}
        />
        {/** SIGNATURE ACTIONS */}
        <DataListAction
          aria-labelledby={`signature-item-${key} signature-action-${key}`}
          id={`signature-action-${key}`}
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
                aria-label="Signature actions"
                icon={<EllipsisVIcon />}
              />
            )}
            isOpen={isActionsOpened}
            onOpenChange={setActionsOpened}
          >
            <DropdownList>
              <DropdownItem
                key="download-bundle"
                isDisabled={!signature.rawBundleJson}
                onClick={() => handleDownloadBundle(signature)}
              >
                Download bundle
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </DataListAction>
      </DataListItemRow>
      <DataListContent
        aria-label="Signature expandable content details"
        id={`sig-expand-${key}`}
        isHidden={!isExpanded}
      >
        <Stack hasGutter>
          {signature.signingCertificate && (
            <StackItem>
              {/** LEAF / SIGNING CERTIFICATE */}
              <LeafCertificate leafCert={signature.signingCertificate} />
            </StackItem>
          )}
          {signature.certificateChain && signature.certificateChain.length > 0 && (
            <StackItem>
              {/** CERTIFICATE CHAIN (INTERMEDIATE + ROOT) */}
              <CertificateChain certificateChain={signature.certificateChain} />
            </StackItem>
          )}
          {signature.rekorEntry && (
            <StackItem>
              {/** REKOR ENTRY */}
              <RekorEntryPanel rekorEntry={signature.rekorEntry as RekorEntry} />
            </StackItem>
          )}
        </Stack>
      </DataListContent>
    </DataListItem>
  );
};
