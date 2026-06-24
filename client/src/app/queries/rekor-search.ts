import { useQuery } from "@tanstack/react-query";
import { useRekorBaseUrl, useRekorClient } from "@app/pages/Rekor/shared/utils/rekor/api/context";
import { type SearchQuery, useRekorSearch } from "@app/pages/Rekor/shared/utils/rekor/api/rekor-api";
import { isNetworkError, isApiError } from "@app/pages/Rekor/shared/utils/rekor/api/error-utils";
import { TimeoutError } from "@app/pages/Rekor/shared/utils/rekor/api/rekor-api";

export const RekorKey = "Rekor";
const RETRY_COUNT = 4;
const INITIAL_RETRY_DELAY_MS = 1000;

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= RETRY_COUNT) return false;
  if (isNetworkError(error) && !navigator.onLine) return false;
  if (isApiError(error) && error.status >= 400 && error.status < 500) return false;
  if (error instanceof TimeoutError) return false;
  return true;
}

export const useFetchRekorEntry = (logIndex: string) => {
  const client = useRekorClient();
  const [baseUrl] = useRekorBaseUrl();

  return useQuery({
    queryKey: [RekorKey, "entry", logIndex, client.entries, baseUrl],
    queryFn: () => client.entries.getLogEntryByIndex({ logIndex: Number(logIndex) }),
  });
};

export const useFetchRekorSearch = (query: SearchQuery | undefined, page: number) => {
  const search = useRekorSearch();
  const [baseUrl] = useRekorBaseUrl();

  return useQuery({
    queryKey: [RekorKey, "search", query, page, search, baseUrl],
    queryFn: () => search(query!, page),
    enabled: !!query,
    retry: shouldRetry,
    retryDelay: (attempt) => INITIAL_RETRY_DELAY_MS * 2 ** attempt,
  });
};
