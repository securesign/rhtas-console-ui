import ENV from "@app/env";
import {
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

const defaultTimeout = 1000;

const mockPromise = <TQueryFnData>(data: TQueryFnData, timeout = defaultTimeout, success = true) => {
  return new Promise<TQueryFnData>((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject(new Error("Error"));
      }
    }, timeout);
  });
};

export const useMockableMutation = <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  params: UseMutationOptions<TData, TError, TVariables, TContext>,
  mockData: TData
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const isMock = ENV.MOCK !== "off";

  return useMutation<TData, TError, TVariables, TContext>({
    ...params,
    mutationFn: async (variables: TVariables) => {
      if (!isMock) {
        return params.mutationFn!(variables);
      }
      return mockPromise(mockData);
    },
  });
};

export const useMockableQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  params: UseQueryOptions<TQueryFnData, TError, TData>,
  mockData: TQueryFnData
) => {
  return useQuery<TQueryFnData, TError, TData>({
    ...params,
    queryFn: ENV.MOCK === "off" ? params.queryFn : () => mockPromise(mockData),
  });
};
