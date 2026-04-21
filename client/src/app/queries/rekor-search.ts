import { useQuery } from "@tanstack/react-query";
import { useRekorBaseUrl, useRekorClient } from "@app/pages/Rekor/shared/utils/rekor/api/context";
import { type SearchQuery, useRekorSearch } from "@app/pages/Rekor/shared/utils/rekor/api/rekor-api";

export const RekorKey = "Rekor";

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
  });
};
