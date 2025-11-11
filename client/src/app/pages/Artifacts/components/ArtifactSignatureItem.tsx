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

export const ArtifactSignatureItem = ({ signature }: { signature: string }) => {
  const [activeItems, setActiveItems] = useState<TreeViewDataItem[]>();
  const [isSignatureExpanded, setExpanded] = useState(false);
  const [isActionsOpened, setActionsOpened] = useState(false);
  const [isCodeCopied, setCodeCopied] = useState(false);

  const handleToggleSignatureItem = () => setExpanded(!isSignatureExpanded);

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
          onClick={() => handleCopyCode(codeMock)}
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

  return (
    <DataListItem aria-labelledby="ex-item1" key="sig-1" isExpanded={isSignatureExpanded}>
      <DataListItemRow>
        <DataListToggle
          onClick={handleToggleSignatureItem}
          isExpanded={isSignatureExpanded}
          id="ex-toggle1"
          aria-controls="ex-expand1"
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
        <DataListAction aria-labelledby="ex-item1 ex-action1" id="ex-action1" aria-label="Actions">
          <Dropdown
            popperProps={{ position: "right" }}
            onSelect={handleActionSelect}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                isExpanded={isActionsOpened}
                onClick={handleToggleActions}
                variant="plain"
                aria-label="Data list exapndable example kebaby toggle 1"
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
              <DropdownItem key="disabled action" isDisabled>
                Download Bundle
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </DataListAction>
      </DataListItemRow>
      <DataListContent aria-label="First expandable content details" id="ex-expand1" isHidden={!isSignatureExpanded}>
        <CodeBlock actions={codeBlockActions}>
          <CodeBlockCode id="code-content">{codeMock}</CodeBlockCode>
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
            <CodeBlockCode id="code-content">{String.raw`Entry #128904331 (UUID abcd…1234)`}</CodeBlockCode>
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

const codeMock = String.raw`data:
      Serial Number: '0x0639cb6e52987006777bb9395de0f08eb09e2ae0'
    Signature:
      Issuer: O=sigstore.dev, CN=sigstore-intermediate
      Validity:
        Not Before: 4 months ago (2025-07-05T13:00:17+01:00)
        Not After: 4 months ago (2025-07-05T13:10:17+01:00)
      Algorithm:
        name: ECDSA
        namedCurve: P-256
      Subject:
        extraNames:
          items: {}
        asn: []
    X509v3 extensions:
      Key Usage (critical):
      - Digital Signature
      Extended Key Usage:
      - Code Signing
      Subject Key Identifier:
      - 47:61:F5:AE:1B:97:1C:DF:8E:70:97:BD:08:55:CB:6A:CE:79:80:02
      Authority Key Identifier:
        keyid: DF:D3:E9:CF:56:24:11:96:F9:A8:D8:E9:28:55:A2:C6:2E:18:64:3F
      Subject Alternative Name (critical):
        email:
        - bob.callaway@gmail.com
      OIDC Issuer: https://login.microsoftonline.com
      OIDC Issuer (v2): https://login.microsoftonline.com
      1.3.6.1.4.1.11129.2.4.2: 04:7b:00:79:00:77:00:dd:3d:30:6a:c6:c7:11:32:63:19:1e:1c:99:67:37:02:a2:4a:5e:b8:de:3c:ad:ff:87:8a:72:80:2f:29:ee:8e:00:00:01:97:da:75:6c:62:00:00:04:03:00:48:30:46:02:21:00:b1:c8:00:32:6d:71:4d:f2:8e:a6:b9:8f:81:99:4e:5a:48:65:72:94:85:ff:14:6f:6e:e0:50:c9:f2:aa:f8:da:02:21:00:95:58:65:f6:1b:c6:77:00:3d:9f:d4:98:a6:43:93:6e:1b:59:4c:b9:b9:85:41:28:3b:da:a3:9a:3f:fb:b5:0b
  
    `;
