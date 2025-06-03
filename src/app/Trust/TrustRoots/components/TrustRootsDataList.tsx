import React, { Fragment } from 'react';

import {
  Content,
  DataList,
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
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { rows } from '../TrustRoots.data';

const TrustRootsDataList = () => {
  const [selectedRow, setSelectedRow] = React.useState('');
  const [isDrawerExpanded, setIsDrawerExpanded] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(undefined);

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
                <div tabIndex={isDrawerExpanded ? 0 : -1} ref={drawerRef as any}>
                  <Content component="small">Certificate Subject</Content>
                  <Content component="p">{selectedRow}</Content>
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
              <div style={{ whiteSpace: 'pre-wrap', padding: '1rem' }}>
                {rows.find((row) => row.subject === selectedRow)?.pem}
              </div>
            </DrawerPanelContent>
          }
        >
          <DrawerContentBody>
            <DataList
              aria-label="Trust root certificate authorities"
              selectedDataListItemId={selectedRow}
              onSelectDataListItem={(_e, id) => {
                setSelectedRow(id);
                setIsDrawerExpanded(true);
              }}
            >
              {rows.map((row, index) => (
                <DataListItem key={index} id={row.subject}>
                  <DataListItemRow>
                    <DataListItemCells
                      dataListCells={[
                        <DataListCell key="subject">
                          <Flex direction={{ default: 'column' }}>
                            <FlexItem>
                              <strong>{row.subject}</strong>
                            </FlexItem>
                            <FlexItem>
                              <Content component="small">{row.pem.split('\n')[1] || ''}</Content>
                            </FlexItem>
                          </Flex>
                        </DataListCell>,
                      ]}
                    />
                  </DataListItemRow>
                </DataListItem>
              ))}
            </DataList>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
};

export { TrustRootsDataList };
