import React from "react";
import { Paths } from "@app/Routes";
import { FilterToolbar } from "@app/components/FilterToolbar/FilterToolbar";
import { MultiselectFilterControl } from "@app/components/FilterToolbar/MultiselectFilterControl";
import { SearchFilterControl } from "@app/components/FilterToolbar/SearchFilterControl";
import { SimplePagination } from "@app/components/SimplePagination";
import { ConditionalTableBody } from "@app/components/TableControls/ConditionalTableBody";
import { useWithUiId } from "@app/hooks/query-utils";
import { usePFToolbarTable } from "@app/hooks/usePFToolbarTable";
import { formatIntegratedTime, stringMatcher } from "@app/utils/utils";
import { Alert, Button, Flex, FlexItem, Label, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { generatePath, Link } from "react-router-dom";
import { Hash } from "@app/pages/Rekor/shared/components/Hash";
import { getHash } from "@app/pages/Rekor/shared/utils/spec";
import { Signature } from "@app/pages/Rekor/shared/components/Signature";
import type { RekorEntries } from "../../shared/utils/rekor/api/rekor-api";
import { PublicKey } from "../../shared/components/PublicKey";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

interface RekorBody {
  kind: string;
  spec: unknown;
  apiVersion: string;
}

interface RekorListRow {
  entryUuid: string;
  logIndex: number;
  integratedTime: number;
  body: RekorBody;
}

export function RekorList({
  rekorEntries,
  page: _page,
  onSetPage: _onSetPage,
}: {
  rekorEntries?: RekorEntries;
  page: number;
  onSetPage: (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, _newPage: number) => void;
}) {
  const entries = rekorEntries?.entries ?? [];

  const rows = useWithUiId(
    entries.map((entry): RekorListRow => {
      const [entryUuid, data] = Object.entries(entry)[0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const body = JSON.parse(window.atob(data.body)) as RekorBody;
      return {
        entryUuid,
        logIndex: data.logIndex,
        integratedTime: data.integratedTime,
        body,
      };
    }),
    (item) => `${item.entryUuid}-${item.logIndex}`
  );

  const typeOptions = Array.from(new Set(rows.map((row) => row.body.kind).filter((value) => value && value !== "-")))
    .sort()
    .map((value) => ({ value, label: value }));

  const tableState = usePFToolbarTable({
    items: rows,
    idProperty: "_ui_unique_id",
    columns: ["integratedTime"],
    toolbar: {
      categoryTitles: {
        entryUuid: "Entry UUID",
        type: "Type",
        commitHash: "Commit hash",
      },
    },
    filtering: {
      filterCategories: [
        {
          categoryKey: "commitHash",
          matcher: (filterValue, item) =>
            stringMatcher(filterValue, getHash({ type: item.body?.kind, spec: item?.body.spec }) ?? ""),
        },
        {
          categoryKey: "entryUuid",
          matcher: (filterValue, item) => stringMatcher(filterValue, item.entryUuid),
        },
        {
          categoryKey: "type",
          matcher: (filterValue, item) => filterValue.toLowerCase() === item.body.kind.toLowerCase(),
        },
      ],
    },
    sorting: {
      sortableColumns: ["integratedTime"],
      initialSort: {
        columnKey: "integratedTime",
        direction: "desc",
      },
      getSortValues: (item) => ({
        integratedTime: item.integratedTime,
        logIndex: item.logIndex,
      }),
    },
  });

  const {
    tableState: { currentPageItems },
    propHelpers: {
      getSortThProps,
      paginationProps,
      paginationToolbarItemProps,
      toolbarProps,
      filterToolbarProps,
      getFilterControlProps,
    },
  } = tableState;

  if (!rekorEntries) {
    return <></>;
  }

  if (entries.length === 0) {
    return <Alert title={"No matching entries found"} variant={"info"} />;
  }

  return (
    <div style={{ marginTop: "1.5em" }}>
      <Toolbar {...toolbarProps} aria-label="Rekor Entries toolbar">
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} showFilterDropdown>
            <SearchFilterControl
              {...getFilterControlProps({ categoryKey: "commitHash" })}
              placeholderText="Search by commit hash"
              showToolbarItem={filterToolbarProps.currentFilterCategoryKey === "commitHash"}
            />
            <SearchFilterControl
              {...getFilterControlProps({ categoryKey: "entryUuid" })}
              placeholderText="Search by entry UUID"
              showToolbarItem={filterToolbarProps.currentFilterCategoryKey === "entryUuid"}
            />
            <MultiselectFilterControl
              {...getFilterControlProps({ categoryKey: "type" })}
              selectOptions={typeOptions}
              placeholderText="Type"
              showToolbarItem={filterToolbarProps.currentFilterCategoryKey === "type"}
            />
          </FilterToolbar>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination idPrefix="rekor-entries-table" isTop paginationProps={paginationProps} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Rekor Entries table">
        <Thead>
          <Tr>
            <Th>Commit Hash</Th>
            <Th>Log Index</Th>
            <Th>Entry UUID</Th>
            <Th>Type</Th>
            <Th>Signature</Th>
            <Th>Public Certificate</Th>
            <Th {...getSortThProps({ columnKey: "integratedTime" })}>Integrated time</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <ConditionalTableBody isNoData={currentPageItems.length === 0} numRenderedColumns={8}>
          <Tbody>
            {currentPageItems.map((row) => {
              const hash = getHash({
                type: row.body.kind,
                spec: row.body.spec,
              });
              return (
                <Tr key={row._ui_unique_id}>
                  <Td dataLabel="Commit Hash" modifier="breakWord">
                    <Button
                      variant="link"
                      isInline
                      component={(buttonProps) => (
                        <Link
                          {...buttonProps}
                          to={{
                            pathname: Paths.rekorSearch,
                            search: hash ? `?hash=${encodeURIComponent(hash)}` : undefined,
                          }}
                        />
                      )}
                      aria-label="Search by this hash"
                    >
                      <Label isCompact color="blue" variant="outline">
                        <Flex spaceItems={{ default: "spaceItemsXs" }}>
                          <FlexItem>
                            <Hash spec={row.body.spec} type={row.body.kind} variant="short" />
                          </FlexItem>
                          <FlexItem>
                            <ExternalLinkAltIcon />
                          </FlexItem>
                        </Flex>
                      </Label>
                    </Button>
                  </Td>
                  <Td dataLabel="Log Index">{row.logIndex}</Td>
                  <Td dataLabel="Entry UUID" modifier="truncate">
                    {row.entryUuid}
                  </Td>
                  <Td dataLabel="Type">{row.body.kind}</Td>
                  <Td dataLabel="Signature" modifier="truncate">
                    <Signature apiVersion={row.body.apiVersion} spec={row.body.spec} type={row.body.kind} />
                  </Td>
                  <Td dataLabel="Public Certificate">
                    <PublicKey
                      apiVersion={row.body.apiVersion}
                      spec={row.body.spec}
                      type={row.body.kind}
                      variant="validity"
                    />
                  </Td>
                  <Td dataLabel="Integrated time">{formatIntegratedTime(row.integratedTime)}</Td>
                  <Td dataLabel="Action">
                    <Button
                      variant="link"
                      isInline
                      component={(buttonProps) => (
                        <Link
                          {...buttonProps}
                          to={{
                            pathname: generatePath(Paths.rekorEntry, {
                              logIndex: String(row.logIndex),
                            }),
                          }}
                        />
                      )}
                    >
                      View details
                    </Button>
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn
                      //TODO: implement proper actions , not visible explanation on designs
                      items={[
                        {
                          title: "Example action",
                          onClick: () => {
                            void console.log("Something");
                          },
                        },
                      ]}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </ConditionalTableBody>
      </Table>

      <SimplePagination idPrefix="rekor-entries-table" isTop={false} paginationProps={paginationProps} />
    </div>
  );
}
