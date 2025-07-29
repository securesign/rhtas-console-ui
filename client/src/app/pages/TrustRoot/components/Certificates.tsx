import React from "react";

import type { AxiosError } from "axios";
import dayjs from "dayjs";

import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import type { _Error, CertificateInfo } from "@app/client";
import { CertificateStatusIcon } from "@app/components/CertificateStatusIcon";
import { FilterToolbar } from "@app/components/FilterToolbar/FilterToolbar";
import { MultiselectFilterControl } from "@app/components/FilterToolbar/MultiselectFilterControl";
import { SearchFilterControl } from "@app/components/FilterToolbar/SearchFilterControl";
import { SimplePagination } from "@app/components/SimplePagination";
import { ConditionalTableBody } from "@app/components/TableControls/ConditionalTableBody";
import { usePFToolbarTable } from "@app/hooks/usePFToolbarTable";
import { useFetchTrustTargetCertificates } from "@app/queries/trust";
import { formatDate, stringMatcher } from "@app/utils/utils";

export const Certificates: React.FC = () => {
  const { certificates, isFetching, fetchError } = useFetchTrustTargetCertificates();

  return <CerticatesTable certificates={certificates?.data ?? []} isFetching={isFetching} fetchError={fetchError} />;
};

interface ICerticatesTableProps {
  certificates: CertificateInfo[];
  isFetching: boolean;
  fetchError: AxiosError<_Error> | null;
}

export const CerticatesTable: React.FC<ICerticatesTableProps> = ({ certificates, isFetching, fetchError }) => {
  const tableState = usePFToolbarTable({
    items: certificates,
    toolbar: {
      categoryTitles: {
        search: "Search",
        status: "Status",
      },
    },
    filtering: {
      filterCategories: [
        {
          categoryKey: "search",
          matcher: (filterValue, item) => {
            return stringMatcher(filterValue, item.issuer);
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
    },
  } = tableState;

  return (
    <>
      <Toolbar {...toolbarProps} aria-label="certificates toolbar">
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps}>
            <SearchFilterControl
              {...getFilterControlProps({ categoryKey: "search" })}
              placeholderText="Search by issuer..."
            />
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
          </FilterToolbar>
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination idPrefix="certificates-table" isTop paginationProps={paginationProps} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="certificates table">
        <Thead>
          <Tr>
            <Th>Issuer</Th>
            <Th>Subject</Th>
            <Th>Target</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th {...getSortThProps({ columnKey: "expiration" })}>Expiration</Th>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isNoData={currentPageItems.length === 0}
          numRenderedColumns={6}
          isLoading={isFetching}
          isError={!!fetchError}
        >
          {currentPageItems.map((certificate, rowIndex) => {
            return (
              <Tbody key={rowIndex}>
                <Tr key={rowIndex}>
                  <Td>{certificate.issuer}</Td>
                  <Td>{certificate.subject}</Td>
                  <Td>{certificate.target}</Td>
                  <Td>{certificate.type}</Td>
                  <Td>
                    <CertificateStatusIcon status={certificate.status} /> {certificate.status}
                  </Td>
                  <Td>{formatDate(certificate.expiration)}</Td>
                </Tr>
              </Tbody>
            );
          })}
        </ConditionalTableBody>
      </Table>
      <SimplePagination idPrefix="certificates-table" isTop={false} paginationProps={paginationProps} />
    </>
  );
};
