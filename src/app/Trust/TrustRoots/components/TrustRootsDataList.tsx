import { Fragment, useRef, useState } from 'react';

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
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
// import { rows } from '../TrustRoots.data';

import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import CodeBranchIcon from '@patternfly/react-icons/dist/esm/icons/code-branch-icon';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import TimesCircleIcon from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';
import { MinusIcon, CalendarAltIcon, FileAltIcon, EllipsisVIcon } from '@patternfly/react-icons';
// import { useQuery } from '@tanstack/react-query';

import { TrustRootsDrawerContent } from './TrustRootsDrawerContent';
import { exampleTrustRoot } from '../TrustRoots.data';

const TrustRootsDataList = () => {
  const [selectedRow, setSelectedRow] = useState('');
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(undefined);

  // const { isPending, error, data } = useQuery({
  //   queryKey: ['trustConfig'],
  //   queryFn: () => fetch('http://localhost:8080/api/v1/trust/config').then((res) => res.json()),
  // });

  // if (isPending) return 'Loading...';

  // if (error) return 'An error has occurred: ' + error.message;

  // if (data) {
  //   console.table(data);
  // }

  const getRow = (id: string, lastStatus: 'success' | 'error' | null, isRunning: boolean) => {
    let mainIcon;
    let lastStatusComponent;

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
                <FileAltIcon /> {exampleTrustRoot.certificates.length} certificates
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
                {mainIcon}
              </DataListCell>,
              <DataListCell key="info" isFilled={false}>
                <Flex direction={{ default: 'column' }}>
                  <FlexItem>
                    <Content component="p">{exampleTrustRoot.name}</Content>
                  </FlexItem>
                  <FlexItem>
                    <Content component="dd">
                      <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          {/* <CodeBranchIcon /> https://github.com/organization/repository.git */}
                          <CodeBranchIcon /> {exampleTrustRoot.source}
                        </FlexItem>
                      </Flex>
                    </Content>
                  </FlexItem>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <CubeIcon /> Type: {exampleTrustRoot.type}
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>
              </DataListCell>,
              <DataListCell key="description">
                <Flex direction={{ default: 'column' }}>
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
          <DropdownItem>Refresh</DropdownItem>
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
                  <Content component="p">{exampleTrustRoot.name}</Content>
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
              aria-label="Demo trust data list"
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
              {getRow('row-1', null, false)}
              {getRow('row-2', null, true)}
              {getRow('row-3', 'success', false)}
              {getRow('row-4', 'error', false)}
              {getRow('row-5', null, false)}
            </DataList>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
};

export { TrustRootsDataList };
