import { useQuery } from "@tanstack/react-query";
import { useRekorClient } from "@app/pages/Rekor/shared/utils/rekor/api/context";
import { type SearchQuery, useRekorSearch } from "@app/pages/Rekor/shared/utils/rekor/api/rekor-api";

export const RekorKey = "Rekor";

export const useFetchRekorEntry = (logIndex: string) => {
  const client = useRekorClient();

  return useQuery({
    queryKey: [RekorKey, "entry", logIndex],
    queryFn: () => client.entries.getLogEntryByIndex({ logIndex: Number(logIndex) }),
  });
};

export const useFetchRekorSearch = (query: SearchQuery | undefined, page: number) => {
  const search = useRekorSearch();

  return useQuery({
    queryKey: [RekorKey, "search", query, page],
    queryFn: () => search(query!, page),
    enabled: !!query,
  });
};
