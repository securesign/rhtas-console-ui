import React from "react";

import type { AxiosError } from "axios";
import dayjs from "dayjs";

import {
  CodeBlock,
  CodeBlockCode,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import { ActionsColumn, ExpandableRowContent, Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import type { _Error, CertificateInfo } from "@app/client";
import { CertificateStatusIcon } from "@app/components/CertificateStatusIcon";
import { FilterToolbar } from "@app/components/FilterToolbar/FilterToolbar";
import { MultiselectFilterControl } from "@app/components/FilterToolbar/MultiselectFilterControl";
import { SearchFilterControl } from "@app/components/FilterToolbar/SearchFilterControl";
import { SimplePagination } from "@app/components/SimplePagination";
import { ConditionalTableBody } from "@app/components/TableControls/ConditionalTableBody";
import { useWithUiId } from "@app/hooks/query-utils";
import { usePFToolbarTable } from "@app/hooks/usePFToolbarTable";
import { formatDate, stringMatcher } from "@app/utils/utils";
import { CertificateDoesNotExist } from "./ErrorStates/CertificateDoesNotExist";
import { ErrorRetrievingCertificate } from "./ErrorStates/ErrorRetrievingCertificate";

interface ICertificatesTableProps {
  certificates: CertificateInfo[];
  isFetching: boolean;
  fetchError: AxiosError<_Error> | null;
}

export const CertificatesTable: React.FC<ICertificatesTableProps> = ({ certificates, isFetching, fetchError }) => {
  if (fetchError) {
    return <ErrorRetrievingCertificate />;
  }

  if (certificates.length === 0) {
    return <CertificateDoesNotExist />;
  }

  const items = useWithUiId(
    certificates,
    (item, index) => `${index}-${item.type}-${item.issuer}-${item.subject}-${item.target}`
  );

  const tableState = usePFToolbarTable({
    items,
    idProperty: "_ui_unique_id",
    columns: ["expiration"],
    toolbar: {
      categoryTitles: {
        subject: "Subject",
        status: "Status",
      },
    },
    filtering: {
      filterCategories: [
        {
          categoryKey: "subject",
          matcher: (filterValue, item) => {
            return stringMatcher(filterValue, item.subject);
          },
        },
        {
          categoryKey: "status",
          matcher: (filterValue, item) => {
            return filterValue.toLowerCase() === item.status.toLowerCase();
          },
        },
      ],
    },
    sorting: {
      sortableColumns: ["expiration"],
      initialSort: {
        columnKey: "expiration",
        direction: "desc",
      },
      getSortValues: (item) => ({
        expiration: dayjs(item.expiration).valueOf(),
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
      getSingleExpandButtonTdProps,
    },
    expansionDerivedState: { isCellExpanded },
  } = tableState;

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  const handleDownload = (value: string) => {
    const filename = "pem.txt";

    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    // Revoke the object URL after a short delay to ensure the download has started
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <>
      <Toolbar {...toolbarProps} aria-label="certificates toolbar">
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} showFilterDropdown>
            {filterToolbarProps.currentFilterCategoryKey === "subject" && (
              <SearchFilterControl
                {...getFilterControlProps({ categoryKey: "subject" })}
                placeholderText="Search by subject"
              />
            )}
            {filterToolbarProps.currentFilterCategoryKey === "status" && (
              <MultiselectFilterControl
                {...getFilterControlProps({ categoryKey: "status" })}
                selectOptions={[
                  {
                    value: "active",
                    label: "Active",
                  },
                  {
                    value: "expiring",
                    label: "Expiring",
                  },
                  {
                    value: "expired",
                    label: "Expired",
                  },
                ]}
                placeholderText="Status"
              />
            )}
          </FilterToolbar>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination idPrefix="certificates-table" isTop paginationProps={paginationProps} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="certificates table" isExpandable>
        <Thead>
          <Tr>
            <Th screenReaderText="Row expansion" />
            <Th>Issuer</Th>
            <Th>Subject</Th>
            <Th>Target</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th {...getSortThProps({ columnKey: "expiration" })}>Expiration</Th>
            <Th screenReaderText="Actions" />
          </Tr>
        </Thead>
        <ConditionalTableBody
          isNoData={currentPageItems.length === 0}
          numRenderedColumns={8}
          isLoading={isFetching}
          isError={!!fetchError}
        >
          {currentPageItems.map((certificate, rowIndex) => {
            return (
              <Tbody key={rowIndex} isExpanded={isCellExpanded(certificate)}>
                <Tr key={rowIndex}>
                  <Td {...getSingleExpandButtonTdProps({ item: certificate, rowIndex })} />
                  <Td modifier="breakWord">{certificate.issuer}</Td>
                  <Td modifier="breakWord">{certificate.subject}</Td>
                  <Td modifier="breakWord">{certificate.target}</Td>
                  <Td width={10} modifier="truncate">
                    {certificate.type}
                  </Td>
                  <Td width={10} modifier="truncate">
                    <CertificateStatusIcon status={certificate.status} /> {certificate.status}
                  </Td>
                  <Td width={10} modifier="truncate">
                    {formatDate(certificate.expiration)}
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={[
                        {
                          title: "Copy PEM",
                          onClick: () => {
                            handleCopy(certificate.pem).catch((err) => console.error(err));
                          },
                        },
                        {
                          title: "Download PEM",
                          onClick: () => {
                            handleDownload(certificate.pem);
                          },
                        },
                      ]}
                    />
                  </Td>
                </Tr>
                {isCellExpanded(certificate) ? (
                  <Tr isExpanded>
                    <Td />
                    <Td colSpan={7} noPadding>
                      <div className={spacing.mMd}>
                        <ExpandableRowContent>
                          <DescriptionList aria-label="Basic example">
                            <DescriptionListGroup>
                              <DescriptionListTerm>PEM</DescriptionListTerm>
                              <DescriptionListDescription>
                                <CodeBlock>
                                  <CodeBlockCode>{certificate.pem}</CodeBlockCode>
                                </CodeBlock>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </ExpandableRowContent>
                      </div>
                    </Td>
                  </Tr>
                ) : null}
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination idPrefix="certificates-table" isTop={false} paginationProps={paginationProps} />
    </>
  );
};
