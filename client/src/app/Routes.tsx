import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { ErrorFallback } from "./components/ErrorFallback";

const Overview = lazy(() => import("./pages/Overview"));
const Certificates = lazy(() => import("./pages/Certificates"));
const TrustRoot = lazy(() => import("./pages/TrustRoot"));

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Overview /> },
    { path: "/certificates", element: <Certificates /> },
    { path: "/trust-root", element: <TrustRoot /> },
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
