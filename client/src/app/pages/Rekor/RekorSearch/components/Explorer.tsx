import { useLocation, useNavigate } from "react-router-dom";
import { Fragment, useCallback, useEffect, useState } from "react";
import { type RekorError } from "rekor";
import { detectAttribute, isAttribute, type SearchQuery } from "@app/pages/Rekor/shared/utils/rekor/api/rekor-api";
import { useFetchRekorSearch } from "@app/queries/rekor-search";
import { RekorSearchForm } from "./SearchForm";
import { Alert, AlertActionLink, Flex, Spinner } from "@patternfly/react-core";
import { RekorList } from "./RekorList";
import { isNetworkError, isApiError } from "@app/pages/Rekor/shared/utils/rekor/api/error-utils";

function isRekorError(body: unknown): body is Required<RekorError> {
  return !!body && typeof body === "object" && ("code" in body || "message" in body);
}

function SearchError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  let title = "An unexpected error occurred";
  let detail: string | undefined;

  if (isNetworkError(error)) {
    title = navigator.onLine
      ? "Could not reach the Rekor server. The server may be unavailable."
      : "You are offline. Check your network connection and try again.";
  } else if (isApiError(error)) {
    title = isRekorError(error.body)
      ? (error.body.message ?? `Error code ${error.body.code}`)
      : `${error.status} ${error.statusText}`;
    detail = error.url;
  } else if (error instanceof Error) {
    title = error.message;
  } else if (typeof error === "string") {
    title = error;
  }

  return (
    <Alert
      style={{ margin: "1em auto" }}
      title={title}
      variant="danger"
      actionLinks={<AlertActionLink onClick={onRetry}>Retry</AlertActionLink>}
    >
      {detail}
    </Alert>
  );
}

function LoadingIndicator({ failureCount }: { failureCount: number }) {
  return (
    <Flex alignItems={{ default: "alignItemsCenter" }} direction={{ default: "column" }} style={{ margin: "1em auto" }}>
      <Spinner />
      {failureCount > 0 && <span>Still trying to reach Rekor server...</span>}
    </Flex>
  );
}

export function Explorer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultSearch, setDefaultSearch] = useState<string>();
  const [query, setQuery] = useState<SearchQuery>();
  const [page, setPage] = useState(1);

  const { data, error, isLoading: loading, failureCount, refetch } = useFetchRekorSearch(query, page);

  const handleSubmit = useCallback(
    (value: string) => {
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
      <RekorSearchForm defaultValue={defaultSearch} onSubmit={handleSubmit} />

      {error ? (
        <SearchError error={error} onRetry={() => void refetch()} />
      ) : loading ? (
        <LoadingIndicator failureCount={failureCount} />
      ) : (
        <RekorList rekorEntries={data} page={page} onSetPage={onSetPage} />
      )}
    </Fragment>
  );
}
