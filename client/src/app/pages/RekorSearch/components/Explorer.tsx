import { useLocation, useNavigate } from "react-router-dom";
import { Fragment, useCallback, useEffect, useState } from "react";
import { ApiError, type RekorError } from "rekor";
import { detectAttribute, isAttribute, type RekorEntries, type SearchQuery, useRekorSearch } from "../api/rekor-api";
import { type FormInputs, SearchForm } from "./SearchForm";
import { Alert, Flex, Spinner } from "@patternfly/react-core";
import { RekorList } from "./RekorList";

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
  const [defaultSearch, setDefaultSearch] = useState<string>();
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

  const handleSubmit = useCallback(
    ({ search }: FormInputs) => {
      const value = search.trim();
      const attribute = detectAttribute(value);
      if (!attribute) return;

      setPage(1);
      void navigate({
        pathname: location.pathname,
        search: `?${attribute}=${encodeURIComponent(value)}`,
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

    setDefaultSearch(value);
    setPage(1);

    if (attribute === "logIndex") {
      const parsed = parseInt(value);
      if (!isNaN(parsed)) {
        setQuery({ attribute, query: parsed });
      }
    } else {
      setQuery({ attribute, query: value });
    }
  }, [location.search]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Fragment>
      <SearchForm
        defaultValues={defaultSearch ? { search: defaultSearch } : undefined}
        isLoading={loading}
        onSubmit={handleSubmit}
      />

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
