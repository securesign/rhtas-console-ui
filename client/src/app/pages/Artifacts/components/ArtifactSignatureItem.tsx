import {
  Content,
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
  CodeBlock,
  CodeBlockCode,
  Panel,
  CodeBlockAction,
  ClipboardCopyButton,
  Timestamp,
  TimestampTooltipVariant,
  TreeView,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useState } from "react";
import type { SignatureView } from "@app/queries/artifacts.view-model";
import { buildCertificateTree } from "../utils/helpers";
import { relativeDateString } from "@app/utils/utils";
import { RekorEntryPanel } from "./RekorEntryPanel";

export const ArtifactSignatureItem = ({ signature }: { signature: SignatureView }) => {
  const [isActionsOpened, setActionsOpened] = useState(false);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const key = signature.hash.value.toString();

  const handleToggleSignatureItem = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleActions = () => setActionsOpened(!isActionsOpened);

  const handleActionSelect = () => {
    // TODO: probably some logic there
    setActionsOpened(false);
  };

  const handleCopyCode = (code: string, id: string) => {
    void navigator.clipboard.writeText(code.toString());
    setCodeCopiedIndex(id);
  };

  const getSharedCodeBlockActions = (code: string, id: string) => (
    <>
      <CodeBlockAction>
        <ClipboardCopyButton
          id="basic-copy-button"
          textId="code-content"
          aria-label="Copy PEM to clipboard"
          onClick={() => handleCopyCode(code, id)}
          exitDelay={codeCopiedIndex === id ? 1500 : 600}
          maxWidth="110px"
          variant="plain"
          onTooltipHidden={() => setCodeCopiedIndex(null)}
        >
          {codeCopiedIndex === id ? "Successfully copied PEM to clipboard!" : "Copy PEM to clipboard"}
        </ClipboardCopyButton>
      </CodeBlockAction>
    </>
  );

  const displayIdentity = signature.identity.san ?? "Unknown identity";
  const digestDisplay = `${signature.hash.algorithm}:${signature.hash.value}`;
  const signatureStatusBadge = signature.status.signature === "verified" ? "Signature ✓" : "Signature ✗";
  const rekorStatusBadge = signature.status.rekor === "present" ? "Rekor ✓" : "Rekor ✗";
  const chainStatusBadge = signature.status.chain === "valid" ? "Chain ✓" : "Chain ✗";
  const verificationStatusDisplay = `${signatureStatusBadge} / ${rekorStatusBadge} / ${chainStatusBadge}`;

  return (
    <DataListItem aria-labelledby="signature-item-1" key="sig-1" isExpanded={isExpanded}>
      <DataListItemRow>
        <DataListToggle
          onClick={handleToggleSignatureItem}
          isExpanded={isExpanded}
          id={`signature-toggle-${key}`}
          aria-controls={`sig-expand-${key}`}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key="identity">
              <span id="compact-item1">{displayIdentity}</span>
            </DataListCell>,
            <DataListCell key="digest">
              <ClipboardCopy
                truncation={{ maxCharsDisplayed: 14 }}
                hoverTip="Copy"
                clickTip="Copied"
                variant="inline-compact"
                isCode
              >
                {digestDisplay}
              </ClipboardCopy>
            </DataListCell>,
            <DataListCell key="signatureType">{signature.kind}</DataListCell>,
            <DataListCell key="integratedTime">
              {signature.timestamp ? (
                <Timestamp tooltip={{ variant: TimestampTooltipVariant.default }} date={new Date(signature.timestamp)}>
                  {relativeDateString(new Date(signature.timestamp))}
                </Timestamp>
              ) : (
                "N/A"
              )}
            </DataListCell>,
            <DataListCell style={{ whiteSpace: "nowrap" }} key="verificationStatus">
              {verificationStatusDisplay}
            </DataListCell>,
          ]}
        />
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
              <DropdownItem key="download bundle" isDisabled>
                Download Bundle
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </DataListAction>
      </DataListItemRow>
      <DataListContent aria-label="Signature expandable content details" id="sig-expand1" isHidden={!isExpanded}>
        <CodeBlock actions={getSharedCodeBlockActions(signature.hash.value, "signature-code")}>
          <CodeBlockCode id="code-content">{signature.hash.value}</CodeBlockCode>
        </CodeBlock>
        <Panel>
          <Content>Certificate Chain</Content>
          <TreeView
            hasAnimations
            hasGuides
            aria-label="Certificate chain"
            data={buildCertificateTree(signature.certificateChain)}
          />
        </Panel>
        <RekorEntryPanel rekorEntry={signature.rekorEntry} />
      </DataListContent>
    </DataListItem>
  );
};
