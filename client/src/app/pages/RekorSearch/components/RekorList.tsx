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
import { Alert, Button, Icon, Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
import { CheckCircleIcon, ExclamationCircleIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";
import { generatePath, Link } from "react-router-dom";
import type { RekorEntries } from "../api/rekor-api";

interface RekorBody {
  kind?: string;
  spec?: {
    data?: {
      hash?: {
        algorithm?: string;
        value?: string;
      };
    };
    content?: {
      payloadHash?: {
        algorithm?: string;
        value?: string;
      };
      envelope?: {
        signatures?: {
          sig?: string;
          publicKey?: string;
        }[];
      };
    };
    signature?: {
      content?: string;
      publicKey?: {
        content?: string;
      };
    };
    signatures?: {
      signature?: string;
      verifier?: string;
    }[];
    publicKey?: string;
  };
}

interface RekorListRow {
  entryUuid: string;
  logIndex: number;
  integratedTime: number;
  type: string;
  commitHash: string;
  signature: string;
  hasValidPublicCertificate: boolean;
}

function decodeBody(bodyRaw: unknown): RekorBody | undefined {
  if (typeof bodyRaw !== "string") {
    return undefined;
  }

  try {
    return JSON.parse(window.atob(bodyRaw)) as RekorBody;
  } catch {
    return undefined;
  }
}

function renderHash(body?: RekorBody): string {
  const hash = body?.spec?.data?.hash ?? body?.spec?.content?.payloadHash;
  if (!hash?.algorithm || !hash?.value) {
    return "-";
  }
  return `${hash.algorithm}:${hash.value}`;
}

function renderSignature(body?: RekorBody): string {
  const signature =
    body?.spec?.signature?.content ??
    body?.spec?.content?.envelope?.signatures?.[0]?.sig ??
    body?.spec?.signatures?.[0]?.signature;
  return signature ?? "-";
}

function hasValidPublicCertificate(body?: RekorBody): boolean {
  //TODO: make a proper validation
  return !!body;
}

function getShortCommitHash(hash: string): string {
  if (hash === "-") {
    return "-";
  }
  const hashValue = hash.includes(":") ? hash.split(":")[1] : hash;
  return hashValue.slice(0, 7);
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
      const body = decodeBody(data.body);
      return {
        entryUuid,
        logIndex: data.logIndex,
        integratedTime: data.integratedTime,
        type: body?.kind ?? "-",
        commitHash: renderHash(body),
        signature: renderSignature(body),
        hasValidPublicCertificate: hasValidPublicCertificate(body),
      };
    }),
    (item) => `${item.entryUuid}-${item.logIndex}`
  );

  const typeOptions = Array.from(new Set(rows.map((row) => row.type).filter((value) => value && value !== "-")))
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
      },
    },
    filtering: {
      filterCategories: [
        {
          categoryKey: "entryUuid",
          matcher: (filterValue, item) => stringMatcher(filterValue, item.entryUuid),
        },
        {
          categoryKey: "type",
          matcher: (filterValue, item) => filterValue.toLowerCase() === item.type.toLowerCase(),
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
      <Toolbar {...toolbarProps} aria-label="rekor entries toolbar">
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} showFilterDropdown>
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

      <Table aria-label="rekor entries table">
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
              return (
                <Tr key={row._ui_unique_id}>
                  <Td dataLabel="Commit Hash" modifier="breakWord">
                    {row.commitHash === "-" ? (
                      "-"
                    ) : (
                      <Button
                        variant="link"
                        isInline
                        icon={<ExternalLinkAltIcon />}
                        iconPosition="right"
                        component={(buttonProps) => (
                          <Link
                            {...buttonProps}
                            to={{
                              pathname: Paths.rekorSearch,
                              search: `?hash=${encodeURIComponent(row.commitHash)}`,
                            }}
                          />
                        )}
                      >
                        {getShortCommitHash(row.commitHash)}
                      </Button>
                    )}
                  </Td>
                  <Td dataLabel="Log Index">{row.logIndex}</Td>
                  <Td dataLabel="Entry UUID" modifier="truncate">
                    {row.entryUuid}
                  </Td>
                  <Td dataLabel="Type">{row.type}</Td>
                  <Td dataLabel="Signature" modifier="truncate">
                    {row.signature}
                  </Td>
                  <Td dataLabel="Public Certificate">
                    {row.hasValidPublicCertificate ? (
                      <span>
                        <Icon status="success">
                          <CheckCircleIcon />
                        </Icon>
                        Valid
                      </span>
                    ) : (
                      <span>
                        <Icon status="danger">
                          <ExclamationCircleIcon />
                        </Icon>
                        Invalid
                      </span>
                    )}
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
