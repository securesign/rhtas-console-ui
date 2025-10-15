import { useLocation, useNavigate } from "react-router-dom";
import { Fragment, useCallback, useEffect, useState } from "react";
import { ApiError, type RekorError } from "rekor";
import { isAttribute, type RekorEntries, type SearchQuery, useRekorSearch } from "../../../api/rekor-api";
import { type FormInputs, SearchForm } from "./SearchForm";
import { Alert, Flex, Spinner, Pagination } from "@patternfly/react-core";
import { Entry } from "./Entry";

const PAGE_SIZE = 20;

function isApiError(error: unknown): error is ApiError {
  return !!error && typeof error === "object" && Object.hasOwn(error, "body");
}

function isRekorError(error: unknown): error is RekorError {
  return !!error && typeof error === "object";
}

function Error({ error }: { error: unknown }) {
  let title = "Unknown error";
  let detail: string | undefined;

  if (isApiError(error)) {
    if (isRekorError(error.body)) {
      title = `Code ${error.body.code}: ${error.body.message}`;
    }
    detail = `${error.url}: ${error.status}`;
  } else if (typeof error == "string") {
    title = error;
  } else if (error instanceof TypeError) {
    title = error.message;
    detail = error.stack;
  }

  return (
    <Alert style={{ margin: "1em auto" }} title={title} variant={"danger"}>
      {detail}
    </Alert>
  );
}

function RekorList({
  rekorEntries,
  page,
  onSetPage,
}: {
  rekorEntries?: RekorEntries;
  page: number;
  onSetPage: (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, _newPage: number) => void;
}) {
  if (!rekorEntries) {
    return <Fragment></Fragment>;
  }

  if (rekorEntries.entries.length === 0) {
    return <Alert title={"No matching entries found"} variant={"info"} />;
  }

  const pageCount = Math.ceil(rekorEntries.totalCount / PAGE_SIZE);

  const firstItem = (page - 1) * PAGE_SIZE + 1;
  const lastItem = firstItem + rekorEntries.entries.length - 1;

  return (
    <div style={{ margin: "2em auto" }}>
      <p>
        Showing {firstItem} - {lastItem} of {rekorEntries.totalCount}
      </p>

      {rekorEntries.entries.map((entry) => (
        <Entry key={Object.values(entry)[0].logIndex} entry={entry} />
      ))}

      {pageCount > 1 && (
        <Pagination
          itemCount={rekorEntries.totalCount}
          perPage={PAGE_SIZE}
          page={page}
          onSetPage={onSetPage}
          perPageOptions={[]}
          variant="bottom"
          style={{ marginTop: "1em" }}
        />
      )}
    </div>
  );
}

function LoadingIndicator() {
  return (
    <Flex alignItems={{ default: "alignItemsCenter" }} direction={{ default: "column" }} style={{ margin: "1em auto" }}>
      <Spinner />
    </Flex>
  );
}

export function Explorer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formInputs, setFormInputs] = useState<FormInputs>();
  const [query, setQuery] = useState<SearchQuery>();
  const search = useRekorSearch();

  const [data, setData] = useState<RekorEntries>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetch() {
      if (!query) {
        return;
      }
      setError(undefined);
      setLoading(true);
      try {
        setData(await search(query, page));
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [query, page, search]);

  const setQueryParams = useCallback(
    (formInputs: FormInputs) => {
      setPage(1);

      navigate({
        pathname: location.pathname,
        search: `?${formInputs.attribute}=${formInputs.value}`,
      });
    },
    [navigate, location.pathname]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const attribute = Array.from(searchParams.keys()).find((key) => isAttribute(key));
    const value = attribute && searchParams.get(attribute);

    if (!value || Array.isArray(value)) {
      return;
    }
    setFormInputs({ attribute, value });
  }, [location.search]);

  useEffect(() => {
    if (formInputs) {
      setPage(1);

      switch (formInputs.attribute) {
        case "logIndex":
          // eslint-disable-next-line no-case-declarations
          const query = parseInt(formInputs.value);
          if (!isNaN(query)) {
            // Ignore invalid numbers.
            setQuery({
              attribute: formInputs.attribute,
              query,
            });
          }
          break;
        default:
          setQuery({
            attribute: formInputs.attribute,
            query: formInputs.value,
          });
      }
    }
  }, [formInputs]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Fragment>
      <SearchForm defaultValues={formInputs} isLoading={loading} onSubmit={setQueryParams} />

      {error ? (
        <Error error={error} />
      ) : loading ? (
        <LoadingIndicator />
      ) : (
        <RekorList rekorEntries={data} page={page} onSetPage={onSetPage} />
      )}
    </Fragment>
  );
}
