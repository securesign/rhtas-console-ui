import { ArtifactAttestation } from "./ArtifactAttestation";
import type { AttestationView } from "@app/client";
import { Table, Thead, Th, Tr, Tbody } from "@patternfly/react-table";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { SimplePagination } from "@app/components/SimplePagination";
import { usePFToolbarTable } from "@app/hooks/usePFToolbarTable";
import { useWithUiId } from "@app/hooks/query-utils";
import { Fragment } from "react";
import { stringMatcher } from "@app/utils/utils";
import { SearchFilterControl } from "@app/components/FilterToolbar/SearchFilterControl";
interface IArtifactAttestationsProps {
  attestations: AttestationView[];
}

export const ArtifactAttestations = ({ attestations }: IArtifactAttestationsProps) => {
  const items = useWithUiId(attestations, (item) => `sig-${item.id}-${item.digest}`);

  const tableState = usePFToolbarTable({
    items,
    idProperty: "_ui_unique_id",
    columns: [],
    toolbar: {
      categoryTitles: {
        identity: "Identity",
      },
    },
    filtering: {
      filterCategories: [
        {
          categoryKey: "identity",
          matcher: (filterValue, item) => {
            const matchWith = item.signingCertificate?.sans.join(", ") ?? "";
            return stringMatcher(filterValue, matchWith);
          },
        },
      ],
    },
  });

  const {
    tableState: { currentPageItems },
    propHelpers: { paginationProps, paginationToolbarItemProps, getFilterControlProps },
  } = tableState;

  const tableColumns = ["Identity", "Digest", "Attestation Type", "Timestamp", "Attestation", "Rekor"];
  return (
    <Fragment>
      <Toolbar inset={{ default: "insetXl" }} aria-label="Attestations toolbar">
        <ToolbarContent>
          <SearchFilterControl
            {...getFilterControlProps({ categoryKey: "identity" })}
            placeholderText="Find by identity"
            showToolbarItem={true}
          />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination idPrefix="attestations-table" isTop paginationProps={paginationProps} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table isExpandable aria-label="Artifact Attestation Table">
        <Thead>
          <Tr>
            <Th screenReaderText="Row expansion" />
            {tableColumns.map((column) => (
              <Th style={{ overflow: "visible" }} key={column}>
                {column}
              </Th>
            ))}
            <Th screenReaderText="Bundle download action row" />
          </Tr>
        </Thead>
        <Tbody isExpanded={true}>
          {currentPageItems.map((attestation, index) => (
            <ArtifactAttestation attestation={attestation} index={index} key={attestation._ui_unique_id} />
          ))}
        </Tbody>
      </Table>
    </Fragment>
  );
};
