import type React from "react";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { Tbody, Td, Tr } from "@patternfly/react-table";

import { ErrorEmptyState } from "@app/components/ErrorEmptyState";

import { NoDataEmptyState } from "./NoDataEmptyState";

export interface IConditionalTableBodyProps {
  numRenderedColumns: number;
  isLoading?: boolean;
  isError?: boolean;
  isNoData?: boolean;
  errorEmptyState?: React.ReactNode;
  noDataEmptyState?: React.ReactNode;
  children: React.ReactNode;
}

export const ConditionalTableBody: React.FC<IConditionalTableBodyProps> = ({
  numRenderedColumns,
  isLoading = false,
  isError = false,
  isNoData = false,
  errorEmptyState = null,
  noDataEmptyState = null,
  children,
}) => (
  <>
    {isLoading ? (
      <Tbody aria-label="Table loading">
        <Tr>
          <Td colSpan={numRenderedColumns}>
            <Bullseye>
              <Spinner size="xl" />
            </Bullseye>
          </Td>
        </Tr>
      </Tbody>
    ) : isError ? (
      <Tbody aria-label="Table error">
        <Tr>
          <Td colSpan={numRenderedColumns}>
            <Bullseye>{errorEmptyState ?? <ErrorEmptyState />}</Bullseye>
          </Td>
        </Tr>
      </Tbody>
    ) : isNoData ? (
      <Tbody aria-label="Table empty">
        <Tr>
          <Td colSpan={numRenderedColumns}>
            <Bullseye>{noDataEmptyState ?? <NoDataEmptyState />}</Bullseye>
          </Td>
        </Tr>
      </Tbody>
    ) : (
      children
    )}
  </>
);
