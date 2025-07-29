import React from "react";

import { Dropdown, DropdownItem, MenuToggle, ToolbarItem, ToolbarToggleGroup } from "@patternfly/react-core";
import { FilterIcon } from "@patternfly/react-icons";

import type { IFilterCategory } from "@app/hooks/TableControls/filtering/types";

export interface IFilterToolbarProps<TItem, TFilterCategoryKey extends string> {
  currentFilterCategoryKey?: TFilterCategoryKey;
  setCurrentFilterCategoryKey: (value: TFilterCategoryKey) => void;
  categoryTitles: Record<TFilterCategoryKey, string>;
  filterCategories: IFilterCategory<TItem, TFilterCategoryKey>[];
  showFilterDropdown?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
}

export const FilterToolbar = <TItem, TFilterCategoryKey extends string>({
  currentFilterCategoryKey,
  setCurrentFilterCategoryKey,
  filterCategories,
  categoryTitles,
  showFilterDropdown,
  isDisabled,
  children,
}: IFilterToolbarProps<TItem, TFilterCategoryKey>) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);

  const onCategorySelect = (category: IFilterCategory<TItem, TFilterCategoryKey>) => {
    setCurrentFilterCategoryKey(category.categoryKey);
    setIsCategoryDropdownOpen(false);
  };

  const currentFilterCategory = filterCategories.find((category) => category.categoryKey === currentFilterCategoryKey);

  const renderDropdownItems = () => {
    return filterCategories.map((category) => (
      <DropdownItem
        id={`filter-category-${category.categoryKey}`}
        key={category.categoryKey}
        onClick={() => onCategorySelect(category)}
      >
        {categoryTitles[category.categoryKey]}
      </DropdownItem>
    ));
  };

  return (
    <ToolbarToggleGroup
      variant="filter-group"
      toggleIcon={<FilterIcon />}
      breakpoint="2xl"
      gap={showFilterDropdown ? { default: "gapMd" } : undefined}
    >
      {showFilterDropdown && (
        <ToolbarItem>
          <Dropdown
            toggle={(toggleRef) => (
              <MenuToggle
                id="filtered-by"
                ref={toggleRef}
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                isDisabled={isDisabled}
              >
                <FilterIcon /> {currentFilterCategory ? categoryTitles[currentFilterCategory.categoryKey] : null}
              </MenuToggle>
            )}
            isOpen={isCategoryDropdownOpen}
          >
            {renderDropdownItems()}
          </Dropdown>
        </ToolbarItem>
      )}
      {children}
    </ToolbarToggleGroup>
  );
};
