import type React from "react";

import type { AxiosError } from "axios";

import { Bullseye, Spinner } from "@patternfly/react-core";

import { ErrorEmptyState } from "./ErrorEmptyState";

export const LoadingWrapper = (props: {
  isFetching: boolean;
  fetchError?: AxiosError | null;
  isFetchingState?: React.ReactNode;
  fetchErrorState?: (error: AxiosError) => React.ReactNode;
  children: React.ReactNode;
}) => {
  if (props.isFetching) {
    return (
      props.isFetchingState ?? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      )
    );
  }
  if (props.fetchError) {
    return props.fetchErrorState ? props.fetchErrorState(props.fetchError) : <ErrorEmptyState />;
  }
  return props.children;
};
