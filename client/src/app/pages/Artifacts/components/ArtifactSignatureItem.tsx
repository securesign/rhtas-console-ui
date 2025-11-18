import {
  Content,
  ContentVariants,
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
  ExpandableSection,
  type TreeViewDataItem,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useState, type MouseEvent } from "react";
import type { SignatureView } from "@app/queries/artifacts";

export const ArtifactSignatureItem = ({ signature, key }: { signature: SignatureView; key: string }) => {
  const [activeItems, setActiveItems] = useState<TreeViewDataItem[]>();
  const [isActionsOpened, setActionsOpened] = useState(false);
  const [codeCopiedIndex, setCodeCopiedIndex] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
          aria-label="Copy to clipboard"
          onClick={() => handleCopyCode(code, id)}
          exitDelay={codeCopiedIndex === id ? 1500 : 600}
          maxWidth="110px"
          variant="plain"
          onTooltipHidden={() => setCodeCopiedIndex(null)}
        >
          {codeCopiedIndex === id ? "Successfully copied to clipboard!" : "Copy to clipboard"}
        </ClipboardCopyButton>
      </CodeBlockAction>
    </>
  );

  const onSelectCertChain = (_event: MouseEvent, treeViewItem: TreeViewDataItem) => {
    // ignore folders for selection
    if (treeViewItem && !treeViewItem.children) {
      setActiveItems([treeViewItem]);
    }
  };

  const displayIdentity = signature.identity.san ?? "Unknown identity";
  const digestDisplay = `${signature.hash.algorithm}:${signature.hash.value.slice(0, 8)}`;
  const signatureStatusBadge = signature.status.signature === "verified" ? "Signature ✓" : "Signature ✗";
  const rekorStatusBadge = signature.status.rekor === "present" ? "Rekor ✓" : "Rekor ✗";
  const chainStatusBadge = signature.status.chain === "valid" ? "Chain ✓" : "Chain ✗";
  const verificationStatusDisplay = `${signatureStatusBadge} / ${rekorStatusBadge} / ${chainStatusBadge}`;
  const rekorEntryLabel = signature.rekorEntry
    ? `Entry #${signature.rekorEntry.logIndex} (UUID ${signature.rekorEntry.uuid})`
    : "No Rekor entry";

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
              <span id="compact-item1">ryordan@redhat.com</span>
            </DataListCell>,
            <DataListCell key="digest">
              <ClipboardCopy hoverTip="Copy" clickTip="Copied" variant="inline-compact" isCode>
                sha256:77db
              </ClipboardCopy>
            </DataListCell>,
            <DataListCell key="signatureType">hashedrekord</DataListCell>,
            <DataListCell key="integratedTime">4 months ago </DataListCell>,
            <DataListCell key="verificationStatus">Signature ✓ / Rekor ✓ / Chain ✓</DataListCell>,
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
              <DropdownItem key="link" to="#" onClick={(event: MouseEvent) => event.preventDefault()}>
                Open in Rekor Search
              </DropdownItem>
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
          <Content component={ContentVariants.h6} style={{ margin: "1em auto" }}>
            Certificate Chain
          </Content>
          {signature.certificateChain.map((cert, index) => (
            <ExpandableSection
              key={`cert-${index}`}
              toggleText={`Certificate ${index + 1}`}
              style={{ marginBottom: "1em" }}
            >
              <CodeBlock actions={getSharedCodeBlockActions(cert, `cert-code-${index}`)}>
                <CodeBlockCode id={`cert-code-${index}`}>{cert}</CodeBlockCode>
              </CodeBlock>
            </ExpandableSection>
          ))}
        </Panel>
        <Panel>
          <Content component={ContentVariants.h6} style={{ margin: "1em auto" }}>
            Rekor Entry
          </Content>
          <CodeBlock>
            <CodeBlockCode id="code-content">{rekorEntryLabel}</CodeBlockCode>
          </CodeBlock>
        </Panel>
      </DataListContent>
    </DataListItem>
  );
};
