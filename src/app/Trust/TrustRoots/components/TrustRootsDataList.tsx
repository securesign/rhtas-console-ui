import React, { Fragment } from 'react';

import {
  Content,
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  Icon,
  Label,
  MenuToggle,
  MenuToggleElement,
  Progress,
  ProgressSize,
} from '@patternfly/react-core';
import {
  CalendarAltIcon,
  ClockIcon,
  EllipsisVIcon,
  FileAltIcon,
  MinusIcon,
  RunningIcon,
} from '@patternfly/react-icons';

import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import CodeBranchIcon from '@patternfly/react-icons/dist/esm/icons/code-branch-icon';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import InProgressIcon from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import PendingIcon from '@patternfly/react-icons/dist/esm/icons/pending-icon';
import TimesCircleIcon from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';

import { TrustRootsDrawerContent } from './TrustRootsDrawerContent';

const TrustRootsDataList = () => {
  const [selectedRow, setSelectedRow] = React.useState('');

  const [isDrawerExpanded, setIsDrawerExpanded] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(undefined);

  const getRow = (id: string, lastStatus: 'success' | 'error' | null, isRunning: boolean, isDisabled: boolean) => {
    let mainIcon;
    let lastStatusComponent;
    let currentStatus;

    if (lastStatus === 'success') {
      mainIcon = (
        <Icon size="xl" status="success">
          <CheckCircleIcon />
        </Icon>
      );
    } else if (lastStatus === 'error') {
      mainIcon = (
        <Icon size="xl" status="danger">
          <TimesCircleIcon />
        </Icon>
      );
    } else {
      mainIcon = (
        <Icon size="xl">
          <MinusIcon />
        </Icon>
      );
    }

    if (lastStatus === 'success' || lastStatus === 'error' || isRunning) {
      lastStatusComponent = (
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <CalendarAltIcon /> 7 hours ago
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <ClockIcon /> 5 minutes
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <FileAltIcon /> 123456 documents
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      );
    }

    if (isRunning) {
      mainIcon = (
        <Icon size="xl" status="info">
          <InProgressIcon />
        </Icon>
      );
    }
    if (isRunning) {
      currentStatus = <Progress title="Time remaining: 2 hours" value={33} size={ProgressSize.sm} />;
    } else {
      currentStatus = (
        <Flex spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <PendingIcon /> Scheduled
          </FlexItem>
        </Flex>
      );
    }

    if (isDisabled) {
      currentStatus = <Label color="orange">Disabled</Label>;
    }

    return (
      <DataListItem id={id} aria-labelledby="Demo-item1">
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell key="icon" isFilled={false}>
                {mainIcon}
              </DataListCell>,
              <DataListCell key="info" isFilled={false}>
                <Flex direction={{ default: 'column' }}>
                  <FlexItem>
                    <Content component="p">Data Source Name</Content>
                  </FlexItem>
                  <FlexItem>
                    <Content component="dd">
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <CodeBranchIcon /> https://github.com/organization/repository.git
                        </FlexItem>
                      </Flex>
                    </Content>
                  </FlexItem>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <CubeIcon /> Advisory
                      </FlexItem>
                      <FlexItem>
                        <CubeIcon /> OSV
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
              </DataListCell>,
              <DataListCell key="description">
                <Flex direction={{ default: 'column' }}>
                  <FlexItem>
                    <Content component="p">This is the description of the Data Source</Content>
                  </FlexItem>
                </Flex>
              </DataListCell>,
              <DataListCell key="status" alignRight>
                {lastStatusComponent}
              </DataListCell>,
              <DataListCell key="progress" alignRight>
                <Flex direction={{ default: 'column' }}>
                  <FlexItem>
                    <RunningIcon /> Every 5 hours
                  </FlexItem>
                  <FlexItem>{currentStatus}</FlexItem>
                </Flex>
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
        popperProps={{ position: 'right' }}
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
          <DropdownItem>Action1</DropdownItem>
          <DropdownItem>Action2</DropdownItem>
        </DropdownList>
      </Dropdown>
    </DataListAction>
  );

  return (
    <Fragment>
      <Drawer isExpanded={isDrawerExpanded} onExpand={() => {}} position="end">
        <DrawerContent
          panelContent={
            <DrawerPanelContent
              isResizable
              onResize={() => {}}
              id="end-resize-panel"
              defaultSize={'750px'}
              minSize={'150px'}
            >
              <DrawerHead>
                {/* eslint-disable @typescript-eslint/no-explicit-any */}
                <div tabIndex={isDrawerExpanded ? 0 : -1} ref={drawerRef as any}>
                  <Content component="small">Name</Content>
                  <Content component="p">Data Source Name</Content>
                </div>
                <DrawerActions>
                  <DrawerCloseButton
                    onClick={() => {
                      setIsDrawerExpanded(false);
                      setSelectedRow('');
                    }}
                  />
                </DrawerActions>
              </DrawerHead>
              <TrustRootsDrawerContent />
            </DrawerPanelContent>
          }
        >
          <DrawerContentBody>
            <DataList
              aria-label="Demo data list"
              selectedDataListItemId={selectedRow}
              onSelectDataListItem={(_e, id) => {
                setSelectedRow(id);
                setIsDrawerExpanded(true);
              }}
              onSelectableRowChange={(_e, id) => {
                setSelectedRow(id);
                setIsDrawerExpanded(true);
              }}
            >
              {getRow('row-1', null, false, false)}
              {getRow('row-2', null, true, false)}
              {getRow('row-3', 'success', false, false)}
              {getRow('row-4', 'error', false, false)}
              {getRow('row-5', null, false, true)}
            </DataList>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
};

export { TrustRootsDataList };
