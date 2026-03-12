import { SearchForm, type SearchFormProps } from "@app/components/SearchForm";
import { detectAttribute } from "../../shared/utils/rekor/api/rekor-api";

type RekorSearchFormProps = Pick<SearchFormProps, "defaultValue" | "onSubmit">;

export function RekorSearchForm({ defaultValue, onSubmit }: RekorSearchFormProps) {
  return (
    <SearchForm
      label="Search"
      placeholder="Enter email or hash or commit SHA or entry UUID or log index"
      ariaLabel="Search input field"
      id="search"
      name="searchInput"
      defaultValue={defaultValue}
      rules={{
        validate: (v) =>
          detectAttribute(v) !== null ||
          "Unrecognized format. Expected: email, hash (sha256:…/sha1:…), commit SHA (40 hex), UUID (64/80 hex), or log index (number).",
      }}
      onSubmit={onSubmit}
    />
  );
}
