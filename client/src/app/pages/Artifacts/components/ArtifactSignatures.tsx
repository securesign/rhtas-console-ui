import { ArtifactSignature } from "./ArtifactSignature";
import type { SignatureView } from "@app/client";
import { Table, Thead, Th, Tr, Tbody } from "@patternfly/react-table";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";
import { SimplePagination } from "@app/components/SimplePagination";
import { usePFToolbarTable } from "@app/hooks/usePFToolbarTable";
import { type WithUiId, useWithUiId } from "@app/hooks/query-utils";
import { Fragment } from "react";
import { toIdentity, stringMatcher } from "@app/utils/utils";
import { SearchFilterControl } from "@app/components/FilterToolbar/SearchFilterControl";

export const ArtifactSignatures = ({ signatures }: { signatures: SignatureView[] }) => {
  const items = useWithUiId(signatures, (item) => `sig-${item.id}-${item.digest}`);

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
            const matchWith = toIdentity(item.signingCertificate)?.san ?? "";
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

  const tableColumns = ["Identity", "Digest", "Signed On", "Signed", "Chain", "Rekor"];
  return (
    <Fragment>
      <Toolbar inset={{ default: "insetXl" }} aria-label="Signatures toolbar">
        <ToolbarContent>
          <SearchFilterControl
            {...getFilterControlProps({ categoryKey: "identity" })}
            placeholderText="Find by identity"
            showToolbarItem={true}
          />
          <ToolbarItem {...paginationToolbarItemProps}>
            <SimplePagination idPrefix="signatures-table" isTop paginationProps={paginationProps} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table isExpandable aria-label="Signatures Table">
        <Thead>
          <Tr>
            <Th screenReaderText="Row expansion" />
            {tableColumns.map((column) => (
              <Th key={column}>{column}</Th>
            ))}
            <Th screenReaderText="Bundle download action row" />
          </Tr>
        </Thead>
        <Tbody isExpanded={true}>
          {currentPageItems.map((signature: WithUiId<SignatureView>, index: number) => (
            <ArtifactSignature signature={signature} index={index} key={signature._ui_unique_id} />
          ))}
        </Tbody>
      </Table>
    </Fragment>
  );
};
