import { SearchInput } from "@patternfly/react-core";

interface SearchInputFieldProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
}

// Set up identifier search input
export const SearchInputField: React.FC<SearchInputFieldProps> = ({ searchValue, onSearchChange }) =>
    <SearchInput
        placeholder="Filter by text"
        value={searchValue}
        onChange={(_event, value) => onSearchChange(value)}
        onClear={() => onSearchChange("")}
    />


// Set up date filter
export const PublishedOnInput = () => <>Date range input here</>;