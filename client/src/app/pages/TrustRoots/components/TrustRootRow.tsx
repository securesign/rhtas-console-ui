import {
  Content,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  type MenuToggleElement,
} from "@patternfly/react-core";
import * as React from "react";
import StatusIcon from "./StatusIcon";
import CodeBranchIcon from "@patternfly/react-icons/dist/esm/icons/code-branch-icon";
import CubeIcon from "@patternfly/react-icons/dist/esm/icons/cube-icon";
import { CalendarAltIcon, FileAltIcon, EllipsisVIcon } from "@patternfly/react-icons";
import { type TrustRootKind } from "../data/TrustRoots.data";

export type LastStatus = "success" | "error" | null;

export interface TrustRootRowProps {
  id: string;
  lastStatus: LastStatus;
  isRunning: boolean;
  trustRoot: TrustRootKind;
}

const TrustRootRow: React.FC<TrustRootRowProps> = ({ id, lastStatus, isRunning, trustRoot }) => {
  let lastStatusComponent;

  if (lastStatus === "success" || lastStatus === "error" || isRunning) {
    lastStatusComponent = (
      <Flex direction={{ default: "column" }}>
        <FlexItem>
          <Flex spaceItems={{ default: "spaceItemsSm" }}>
            <FlexItem>
              <CalendarAltIcon /> 7 hours ago
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <Flex spaceItems={{ default: "spaceItemsSm" }}>
            <FlexItem>
              <FileAltIcon /> {trustRoot.certificates.length} certificates
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>
    );
  }

  return (
    <DataListItem id={id} aria-labelledby="Demo-item1">
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="icon" isFilled={false}>
              <StatusIcon status={lastStatus as string} />
            </DataListCell>,
            <DataListCell key="info" isFilled={false}>
              <Flex direction={{ default: "column" }}>
                <FlexItem>
                  <Content component="p">{trustRoot.name}</Content>
                </FlexItem>
                <FlexItem>
                  <Content component="dd">
                    <Flex spaceItems={{ default: "spaceItemsSm" }}>
                      <FlexItem>
                        {/* <CodeBranchIcon /> https://github.com/organization/repository.git */}
                        <CodeBranchIcon /> {trustRoot.source}
                      </FlexItem>
                    </Flex>
                  </Content>
                </FlexItem>
                <FlexItem>
                  <Flex spaceItems={{ default: "spaceItemsSm" }}>
                    <FlexItem>
                      <CubeIcon /> Type: {trustRoot.type}
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
            </DataListCell>,
            <DataListCell key="description">
              <Flex direction={{ default: "column" }}>
                <FlexItem>
                  <Content component="p">This is the description of the Root</Content>
                </FlexItem>
              </Flex>
            </DataListCell>,
            <DataListCell key="status" alignRight>
              {lastStatusComponent}
            </DataListCell>,
          ]}
        />
        {action}
      </DataListItemRow>
    </DataListItem>
  );
};

const action = (
  <DataListAction id="actions" aria-label="Actions" aria-labelledby="actions">
    <Dropdown
      popperProps={{ position: "right" }}
      onSelect={() => {}}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          isExpanded={false}
          onClick={() => {}}
          variant="plain"
          aria-label="Data list with checkboxes, actions and additional cells example kebab toggle 2"
          icon={<EllipsisVIcon />}
        />
      )}
      isOpen={false}
      onOpenChange={() => {}}
    >
      <DropdownList>
        <DropdownItem>Refresh</DropdownItem>
      </DropdownList>
    </Dropdown>
  </DataListAction>
);

export default TrustRootRow;
