import React from "react";

import { Button, ButtonVariant, InputGroup, SearchInput, TextInput, ToolbarFilter } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

import type { IFilterControlProps } from "./FilterControl";

export interface ISearchFilterControlProps<TFilterCategoryKey extends string>
  extends IFilterControlProps<TFilterCategoryKey> {
  placeholderText: string;
  isNumeric?: boolean;
}

export const SearchFilterControl = <TFilterCategoryKey extends string>({
  categoryKey,
  categoryName,
  filterValue,
  setFilterValue,
  showToolbarItem = true,
  isDisabled = false,
  placeholderText,
  isNumeric = false,
}: React.PropsWithChildren<ISearchFilterControlProps<TFilterCategoryKey>>): JSX.Element | null => {
  // Keep internal copy of value until submitted by user
  const [inputValue, setInputValue] = React.useState(filterValue?.[0] ?? "");
  // Update it if it changes externally
  React.useEffect(() => {
    setInputValue(filterValue?.[0] ?? "");
  }, [filterValue]);

  const onFilterSubmit = () => {
    const trimmedValue = inputValue.trim();
    setFilterValue(trimmedValue ? [trimmedValue.replace(/\s+/g, " ")] : []);
  };

  const id = `${categoryKey}-input`;

  const inputProps = {
    name: id,
    onChange: (_: React.FormEvent, value: string) => setInputValue(value),
    "aria-label": `${categoryName} filter`,
    value: inputValue,
    placeholder: placeholderText,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key && event.key !== "Enter") return;
      onFilterSubmit();
    },
    isDisabled: isDisabled,
  };

  return (
    <ToolbarFilter
      labels={filterValue?.map((value) => ({ key: value, node: value })) ?? []}
      deleteLabel={() => setFilterValue([])}
      categoryName={categoryName}
      showToolbarItem={showToolbarItem}
    >
      {isNumeric ? (
        <InputGroup>
          <TextInput type="number" id="search-input" {...inputProps} />
          <Button
            icon={<SearchIcon />}
            variant={ButtonVariant.control}
            id="search-button"
            aria-label="search button for search input"
            onClick={onFilterSubmit}
            isDisabled={isDisabled}
          />
        </InputGroup>
      ) : (
        <SearchInput inputProps={{ id: "search-input" }} {...inputProps} />
      )}
    </ToolbarFilter>
  );
};
