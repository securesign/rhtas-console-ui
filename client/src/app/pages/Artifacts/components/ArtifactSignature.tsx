import {
  ClipboardCopy,
  Dropdown,
  type MenuToggleElement,
  MenuToggle,
  DropdownList,
  DropdownItem,
  Timestamp,
  TimestampTooltipVariant,
  Stack,
  StackItem,
  Truncate,
} from "@patternfly/react-core";
import { CheckIcon, EllipsisVIcon, TimesIcon } from "@patternfly/react-icons";
import { useState } from "react";
import { handleDownloadBundle, relativeDateString, toIdentity } from "@app/utils/utils";
import { RekorEntryPanel } from "./RekorEntryPanel";
import { LeafCertificate } from "./LeafCertificate";
import { CertificateChain } from "./CertificateChain";
import type { SignatureView } from "@app/client";
import { Tr, Td, ExpandableRowContent } from "@patternfly/react-table";

export const ArtifactSignature = ({ signature, index }: { signature: SignatureView; index: number }) => {
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
  const signatureStatusBadge = signature.signatureStatus.signature === "verified" ? <CheckIcon /> : <TimesIcon />;
  const rekorStatusBadge = signature.signatureStatus.rekor === "verified" ? <CheckIcon /> : <TimesIcon />;
  const chainStatusBadge = signature.signatureStatus.chain === "verified" ? <CheckIcon /> : <TimesIcon />;

  return (
    <>
      <Tr isContentExpanded={isExpanded}>
        <Td
          expand={{
            rowIndex: index,
            isExpanded,
            onToggle: handleToggleSignatureItem,
          }}
        />
        <Td>
          <Truncate maxCharsDisplayed={20} content={displayIdentity} />
        </Td>
        <Td>
          <ClipboardCopy
            truncation={{ maxCharsDisplayed: 14 }}
            hoverTip="Copy signature SHA"
            clickTip="Copied"
            isCode
            variant={"inline-compact"}
          >
            {signature.digest}
          </ClipboardCopy>
        </Td>
        <Td>
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
        </Td>
        <Td>{signatureStatusBadge}</Td>
        <Td>{chainStatusBadge}</Td>
        <Td>{rekorStatusBadge}</Td>
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
        </Td>
      </Tr>
      <Tr aria-labelledby={`signature-item-${key}`} key={`${key}`} isExpanded={isExpanded}>
        <Td colSpan={8}>
          <ExpandableRowContent>
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
                  <CertificateChain
                    certificateChain={signature.certificateChain}
                    status={signature.signatureStatus.chain}
                  />
                </StackItem>
              )}
              {signature.rekorEntry && (
                <StackItem>
                  {/** REKOR ENTRY */}
                  <RekorEntryPanel rekorEntry={signature.rekorEntry} status={signature.signatureStatus.rekor} />
                </StackItem>
              )}
            </Stack>
          </ExpandableRowContent>
        </Td>
      </Tr>
    </>
  );
};
