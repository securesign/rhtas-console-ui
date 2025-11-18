import type { Signature } from "@app/client";
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
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useState, type MouseEvent } from "react";

export const ArtifactSignatureItem = ({ signature }: { signature: Signature }) => {
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

  return (
    <DataListItem aria-labelledby="signature-item-1" key="sig-1" isExpanded={isExpanded}>
      <DataListItemRow>
        <DataListToggle
          onClick={handleToggleSignatureItem}
          isExpanded={isExpanded}
          id="ex-toggle1"
          aria-controls="sig-expand1"
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
          aria-labelledby="signature-item-1 signature-action-1"
          id="signature-action-1"
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
        <CodeBlock actions={getSharedCodeBlockActions(signature.signature, "signature-code")}>
          <CodeBlockCode id="code-content">{signature.signature}</CodeBlockCode>
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
            <CodeBlockCode id="code-content">{String.raw`Entry #128904331 (UUID abcd...1234)`}</CodeBlockCode>
          </CodeBlock>
        </Panel>
      </DataListContent>
    </DataListItem>
  );
};
