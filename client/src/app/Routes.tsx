import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { ErrorFallback } from "./components/ErrorFallback";

const TrustRoot = lazy(() => import("./pages/TrustRoot"));
const RekorSearch = lazy(() => import("./pages/RekorSearch"));

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Navigate to="/trust-root" /> },
    { path: "/trust-root", element: <TrustRoot /> },
    { path: "/rekor-search", element: <RekorSearch /> },
  ]);

  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <ErrorBoundary FallbackComponent={ErrorFallback} key={location.pathname}>
        {allRoutes}
      </ErrorBoundary>
    </Suspense>
  );
};
