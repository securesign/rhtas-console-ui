import {
  Content,
  Flex,
  FlexItem,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
  PageSection,
  Pagination,
  PaginationVariant,
  Popper,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
  Tooltip,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { rows, columns, CertificatesDataRow } from './Certificates.data';
import ShieldIcon from '@patternfly/react-icons/dist/esm/icons/shield-alt-icon';

export interface ICertificatesPageProps {
  sampleProp?: string;
}

type Direction = 'asc' | 'desc' | undefined;

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const CertificatesPage = ({}: ICertificatesPageProps) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [searchCvssValue, setSearchCvssValue] = useState('');

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const onSearchCvssChange = (value: string) => {
    setSearchCvssValue(value);
  };

  const handleSetPage = (_evt: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageSelect = (_evt: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
    setPerPage(newPerPage);
  };

  const renderPagination = (variant: 'top' | 'bottom' | PaginationVariant, isCompact: boolean) => (
    <Pagination
      isCompact={isCompact}
      itemCount={rows.length}
      page={page}
      perPage={perPage}
      onSetPage={handleSetPage}
      onPerPageSelect={handlePerPageSelect}
      perPageOptions={[
        { title: '10', value: 10 },
        { title: '20', value: 20 },
        { title: '50', value: 50 },
        { title: '100', value: 100 },
      ]}
      variant={variant}
      titles={{
        paginationAriaLabel: `${variant} pagination`,
      }}
    />
  );

  // Table sorting

  const sortRows = (rows: CertificatesDataRow[], sortIndex: number, sortDirection: Direction) => {
    return [...rows].sort((a, b) => {
      let returnValue = 0;

      if (typeof Object.values(a)[sortIndex] === 'number') {
        // numeric sort
        returnValue = Object.values(a)[sortIndex] - Object.values(b)[sortIndex];
      } else {
        // string sort
        returnValue = Object.values(a)[sortIndex].localeCompare(Object.values(b)[sortIndex]);
      }
      if (sortDirection === 'desc') {
        return returnValue * -1;
      }
      return returnValue;
    });
  };

  const [sortedData, setSortedData] = useState([...sortRows(rows, 0, 'asc')]);
  const [sortedRows, setSortedRows] = useState([...sortedData]);

  // index of the currently active column
  const [activeSortIndex, setActiveSortIndex] = useState(0);
  // sort direction of the currently active column
  const [activeSortDirection, setActiveSortDirection] = useState<Direction>('asc');

  const onSort = (_event: unknown, index: number, direction: Direction) => {
    setActiveSortIndex(index);
    setActiveSortDirection(direction);

    setSortedData(sortRows(rows, index, direction));
  };

  useEffect(() => {
    setSortedRows(sortedData.slice((page - 1) * perPage, page * perPage));
  }, [sortedData, page, perPage]);

  const getFilteredAndSortedRows = useCallback(() => {
    let filtered = rows;
    if (searchCvssValue) {
      const input = new RegExp(searchCvssValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filtered = rows.filter((row) => input.test(row.identifier));
    }

    if (searchValue) {
      const input = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filtered = rows.filter((row) => input.test(row.title));
    }

    return [...filtered].sort((a, b) => {
      const aVal = Object.values(a)[activeSortIndex];
      const bVal = Object.values(b)[activeSortIndex];
      let result = 0;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        result = aVal - bVal;
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        result = aVal.localeCompare(bVal);
      }

      return activeSortDirection === 'desc' ? -result : result;
    });
  }, [searchValue, searchCvssValue, activeSortIndex, activeSortDirection]);

  useEffect(() => {
    const filteredSorted = getFilteredAndSortedRows();
    setSortedData(filteredSorted);
    setSortedRows(filteredSorted.slice((page - 1) * perPage, page * perPage));
  }, [getFilteredAndSortedRows, page, perPage]);

  // Set up attribute selector
  const [activeAttributeMenu, setActiveAttributeMenu] = useState<'Filter text' | 'CVSS' | 'Revision'>('Filter text');
  const [isAttributeMenuOpen, setIsAttributeMenuOpen] = useState(false);
  const attributeToggleRef = useRef<HTMLButtonElement>(null);
  const attributeMenuRef = useRef<HTMLDivElement>(null);
  const attributeContainerRef = useRef<HTMLDivElement>(null);

  const handleAttribueMenuKeys = (event: KeyboardEvent) => {
    if (!isAttributeMenuOpen) {
      return;
    }
    if (
      attributeMenuRef.current?.contains(event.target as Node) ||
      attributeToggleRef.current?.contains(event.target as Node)
    ) {
      if (event.key === 'Escape' || event.key === 'Tab') {
        setIsAttributeMenuOpen(!isAttributeMenuOpen);
        attributeToggleRef.current?.focus();
      }
    }
  };

  const handleAttributeClickOutside = (event: MouseEvent) => {
    if (isAttributeMenuOpen && !attributeMenuRef.current?.contains(event.target as Node)) {
      setIsAttributeMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleAttribueMenuKeys);
    window.addEventListener('click', handleAttributeClickOutside);
    return () => {
      window.removeEventListener('keydown', handleAttribueMenuKeys);
      window.removeEventListener('click', handleAttributeClickOutside);
    };
  }, [isAttributeMenuOpen, attributeMenuRef]);

  const onAttributeToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setTimeout(() => {
      if (attributeMenuRef.current) {
        const firstElement = attributeMenuRef.current.querySelector('li > button:not(:disabled)');
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        firstElement && (firstElement as HTMLElement).focus();
      }
    }, 0);
    setIsAttributeMenuOpen(!isAttributeMenuOpen);
  };

  const attributeToggle = (
    <MenuToggle
      ref={attributeToggleRef}
      onClick={onAttributeToggleClick}
      isExpanded={isAttributeMenuOpen}
      icon={<FilterIcon />}
    >
      {activeAttributeMenu}
    </MenuToggle>
  );

  const attributeMenu = (
    <Menu
      ref={attributeMenuRef}
      onSelect={(_ev, itemId) => {
        setActiveAttributeMenu(itemId?.toString() as 'Filter text' | 'Revision');
        setIsAttributeMenuOpen(!isAttributeMenuOpen);
      }}
    >
      <MenuContent>
        <MenuList>
          <MenuItem itemId="Filter text">Filter text</MenuItem>
          <MenuItem itemId="CVSS">CVSS</MenuItem>
          <MenuItem itemId="Created on">Created on</MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  const attributeDropdown = (
    <div ref={attributeContainerRef}>
      <Popper
        trigger={attributeToggle}
        triggerRef={attributeToggleRef}
        popper={attributeMenu}
        popperRef={attributeMenuRef}
        appendTo={attributeContainerRef.current || undefined}
        isVisible={isAttributeMenuOpen}
      />
    </div>
  );

  // Set up identifier search input
  const searchInput = (
    <SearchInput
      placeholder="Filter by text"
      value={searchValue}
      onChange={(_event, value) => onSearchChange(value)}
      onClear={() => onSearchChange('')}
    />
  );

  const searchCvssInput = (
    <SearchInput
      placeholder="CVSS"
      value={searchCvssValue}
      onChange={(_event, value) => onSearchCvssChange(value)}
      onClear={() => onSearchCvssChange('')}
    />
  );

  // Set up date filter
  const publishedOnInput = <>Date range input here</>;

  const toggleGroupItems = (
    <ToolbarGroup variant="filter-group">
      <ToolbarItem>{attributeDropdown}</ToolbarItem>
      <ToolbarFilter
        labels={searchValue !== '' ? [searchValue] : ([] as string[])}
        deleteLabel={() => setSearchValue('')}
        deleteLabelGroup={() => setSearchValue('')}
        categoryName="Title"
        showToolbarItem={activeAttributeMenu === 'Filter text'}
      >
        {searchInput}
      </ToolbarFilter>
      <ToolbarFilter
        labels={searchCvssValue !== '' ? [searchCvssValue] : ([] as string[])}
        deleteLabel={() => setSearchCvssValue('')}
        deleteLabelGroup={() => setSearchCvssValue('')}
        categoryName="Identifier"
        showToolbarItem={activeAttributeMenu === 'CVSS'}
      >
        {searchCvssInput}
      </ToolbarFilter>
      <ToolbarFilter categoryName={'Revision'} showToolbarItem={activeAttributeMenu === 'Revision'}>
        {publishedOnInput}
      </ToolbarFilter>
      <ToolbarItem variant="pagination">{renderPagination('top', true)}</ToolbarItem>
    </ToolbarGroup>
  );

  const toolbarItems = (
    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
      {toggleGroupItems}
    </ToolbarToggleGroup>
  );

  return (
    <>
      <PageSection>
        <Content>
          <h1>Certificates</h1>
        </Content>
        <Toolbar
          id="attribute-search-filter-toolbar"
          clearAllFilters={() => {
            setSearchValue('');
            setSearchCvssValue('');
          }}
        >
          <ToolbarContent>{toolbarItems}</ToolbarContent>
        </Toolbar>
      </PageSection>
      <PageSection>
        <Table aria-label="Sortable Table">
          <Thead>
            <Tr>
              {columns.map((column, columnIndex) => {
                const sortParams = {
                  sort: {
                    sortBy: {
                      index: activeSortIndex,
                      direction: activeSortDirection,
                    },
                    onSort,
                    columnIndex,
                  },
                };
                return (
                  <Th modifier={columnIndex !== 6 ? 'wrap' : undefined} key={columnIndex} {...sortParams}>
                    {column}
                  </Th>
                );
              })}
            </Tr>
          </Thead>
          <Tbody>
            {sortedRows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                <>
                  <Td dataLabel={columns[0]} width={15}>
                    <div>{row.identifier}</div>
                  </Td>
                  <Td dataLabel={columns[1]} width={15} modifier={'truncate'}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>{row.title}</FlexItem>
                    </Flex>
                  </Td>
                  <Td dataLabel={columns[2]} width={10}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <Flex
                        spaceItems={{ default: 'spaceItemsSm' }}
                        alignItems={{ default: 'alignItemsCenter' }}
                        flexWrap={{ default: 'nowrap' }}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <FlexItem>
                          <Flex>
                            <FlexItem key={row?.severity} spacer={{ default: 'spacerXs' }}>
                              <Flex
                                spaceItems={{ default: 'spaceItemsXs' }}
                                alignItems={{ default: 'alignItemsCenter' }}
                                flexWrap={{ default: 'nowrap' }}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                <FlexItem>
                                  {/* Severity Shield and Text */}
                                  <Flex
                                    spaceItems={{ default: 'spaceItemsXs' }}
                                    alignItems={{ default: 'alignItemsCenter' }}
                                    flexWrap={{ default: 'nowrap' }}
                                    style={{ whiteSpace: 'nowrap' }}
                                  >
                                    <FlexItem>
                                      <Tooltip content={capitalizeFirstLetter(row.severity ?? '')}>
                                        <ShieldIcon color={'grey'} />
                                      </Tooltip>
                                    </FlexItem>{' '}
                                    {capitalizeFirstLetter(row.severity ?? '')}
                                  </Flex>
                                </FlexItem>
                              </Flex>
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td dataLabel={columns[4]} width={10}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>{row.published}</FlexItem>
                    </Flex>
                  </Td>
                  <Td dataLabel={columns[5]} width={10}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>{row.sboms}</FlexItem>
                    </Flex>
                  </Td>
                </>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {renderPagination('bottom', false)}
      </PageSection>
    </>
  );
};

export { CertificatesPage };
