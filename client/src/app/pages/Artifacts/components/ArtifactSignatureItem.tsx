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
  TreeView,
  CodeBlockAction,
  ClipboardCopyButton,
  type TreeViewDataItem,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useState, type MouseEvent } from "react";

export const ArtifactSignatureItem = ({ signature, idx }: { signature: Signature; idx: number }) => {
  const [activeItems, setActiveItems] = useState<TreeViewDataItem[]>();
  const [isActionsOpened, setActionsOpened] = useState(false);
  const [isCodeCopied, setCodeCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggleSignatureItem = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleToggleActions = () => setActionsOpened(!isActionsOpened);

  const handleActionSelect = () => {
    // TODO: probably some logic there
    setActionsOpened(false);
  };

  const handleCopyCode = (code: string) => {
    void navigator.clipboard.writeText(code.toString());
    setCodeCopied(true);
  };

  const onSelectCertChain = (_event: MouseEvent, treeViewItem: TreeViewDataItem) => {
    // ignore folders for selection
    if (treeViewItem && !treeViewItem.children) {
      setActiveItems([treeViewItem]);
    }
  };

  const codeBlockActions = (
    <>
      <CodeBlockAction>
        <ClipboardCopyButton
          id="basic-copy-button"
          textId="code-content"
          aria-label="Copy to clipboard"
          onClick={() => handleCopyCode(signature.signature)}
          exitDelay={isCodeCopied ? 1500 : 600}
          maxWidth="110px"
          variant="plain"
          onTooltipHidden={() => setCodeCopied(false)}
        >
          {isCodeCopied ? "Successfully copied to clipboard!" : "Copy to clipboard"}
        </ClipboardCopyButton>
      </CodeBlockAction>
    </>
  );

  const isExpanded = expandedIndex === idx;

  return (
    <DataListItem aria-labelledby="signature-item-1" key="sig-1" isExpanded={isExpanded}>
      <DataListItemRow>
        <DataListToggle
          onClick={() => handleToggleSignatureItem(idx)}
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
        <CodeBlock actions={codeBlockActions}>
          <CodeBlockCode id="code-content">{signature.signature}</CodeBlockCode>
        </CodeBlock>
        <Panel>
          <Content component={ContentVariants.h6} style={{ margin: "1em auto" }}>
            Certificate Chain
          </Content>
          <TreeView
            hasAnimations
            hasGuides
            aria-label="Certificate chain"
            data={certificateChainMock}
            activeItems={activeItems}
            onSelect={onSelectCertChain}
          />
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

const certificateChainMock = [
  {
    name: "Leaf Certificate  [Valid ✓]  [Copy PEM] [Download] [View X.509 fields]",
    id: "example1-AppLaunch",
    children: [
      {
        name: "Subject",
        id: "example1-App1",
        children: [
          { name: "Settings", id: "example1-App1Settings" },
          { name: "Current", id: "example1-App1Current" },
        ],
      },
      {
        name: "Extensions",
        id: "example1-App2",
        children: [
          { name: "Settings", id: "example1-App2Settings" },
          {
            name: "Loader",
            id: "example1-App2Loader",
            children: [
              { name: "Loading App 1", id: "example1-LoadApp1" },
              { name: "Loading App 2", id: "example1-LoadApp2" },
              { name: "Loading App 3", id: "example1-LoadApp3" },
            ],
          },
        ],
      },
    ],
    defaultExpanded: true,
  },
  {
    name: "Intermediate A",
    id: "example1-Cost",
    children: [
      {
        name: "Authority Key ID",
        id: "example1-App3",
        children: [
          { name: "Settings", id: "example1-App3Settings" },
          { name: "Current", id: "example1-App3Current" },
        ],
      },
    ],
  },
  {
    name: "Root (Trust Anchor)",
    id: "example1-Sources",
    children: [
      { name: "Application 4", id: "example1-App4", children: [{ name: "Settings", id: "example1-App4Settings" }] },
    ],
  },
];
