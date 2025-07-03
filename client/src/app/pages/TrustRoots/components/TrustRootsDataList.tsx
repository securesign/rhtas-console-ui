import { Fragment, useRef, useState } from "react";

import {
  Content,
  DataList,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
} from '@patternfly/react-core';
// import { rows } from '../TrustRoots.data';

// import { useQuery } from '@tanstack/react-query';

import { TrustRootsDrawerContent } from './TrustRootsDrawerContent';
import { exampleTrustRoots } from '../data/TrustRoots.data';
import TrustRootRow, { LastStatus, TrustRootRowProps } from './TrustRootRow';

const TrustRootsDataList = () => {
  const [selectedRow, setSelectedRow] = useState("");
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

  const getStatus = (id: string): LastStatus => {
    const dummyStatuses: { id: string; lastStatus: LastStatus }[] = [
      { id: exampleTrustRoots[0].id, lastStatus: null },
      { id: exampleTrustRoots[1].id, lastStatus: null },
      { id: exampleTrustRoots[2].id, lastStatus: 'success' },
      { id: exampleTrustRoots[3].id, lastStatus: 'error' },
      { id: exampleTrustRoots[4].id, lastStatus: null },
    ];
    // to be updated
    return dummyStatuses.find((status) => status.id === id)?.lastStatus ?? null;
  };

  const getIsRunning = (id: string): boolean => {
    const dummyRuns = [
      { id: exampleTrustRoots[0].id, running: false },
      { id: exampleTrustRoots[1].id, running: true },
      { id: exampleTrustRoots[2].id, running: false },
      { id: exampleTrustRoots[3].id, running: true },
      { id: exampleTrustRoots[4].id, running: false },
    ];
    return dummyRuns.find((run) => run.id === id)?.running ?? false;
  };

  const rowData: TrustRootRowProps[] = exampleTrustRoots.map((trustRoot) => {
    return {
      id: trustRoot.id,
      lastStatus: getStatus(trustRoot.id),
      isRunning: getIsRunning(trustRoot.id),
      trustRoot,
    };
  });

  // const rowData: TrustRootRowProps[] = [
  //   { id: 'row-1', lastStatus: null, isRunning: false },
  //   { id: 'row-2', lastStatus: null, isRunning: true },
  //   { id: 'row-3', lastStatus: 'success', isRunning: false },
  //   { id: 'row-4', lastStatus: 'error', isRunning: false },
  //   { id: 'row-5', lastStatus: null, isRunning: false },
  // ];

  return (
    <Fragment>
      <Drawer isExpanded={isDrawerExpanded} onExpand={() => {}} position="end">
        <DrawerContent
          panelContent={
            <DrawerPanelContent
              isResizable
              onResize={() => {}}
              id="end-resize-panel"
              defaultSize={"750px"}
              minSize={"150px"}
            >
              <DrawerHead>
                {/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
                <div tabIndex={isDrawerExpanded ? 0 : -1} ref={drawerRef as any}>
                  <Content component="small">Name</Content>
                  <Content component="p">
                    {exampleTrustRoots.find((tr) => tr.id === selectedRow)?.name ?? selectedRow}
                  </Content>
                </div>
                <DrawerActions>
                  <DrawerCloseButton
                    onClick={() => {
                      setIsDrawerExpanded(false);
                      setSelectedRow("");
                    }}
                  />
                </DrawerActions>
              </DrawerHead>
              <TrustRootsDrawerContent trustRootId={selectedRow} />
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
              {rowData.map((row) => (
                <TrustRootRow key={row.id} {...row} />
              ))}
            </DataList>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
};

export { TrustRootsDataList };
