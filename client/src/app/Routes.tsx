import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";
import { ErrorFallback } from "./components/ErrorFallback";
import NotFound from "./pages/NotFound";
import { useFeatureFlags } from "./hooks/useFeatureFlags";

const Artifacts = lazy(() => import("./pages/Artifacts"));
const TrustRoot = lazy(() => import("./pages/TrustRoot"));
const RekorSearch = lazy(() => import("./pages/RekorSearch"));
const Monitoring = lazy(() => import("./pages/Monitoring"));

export const Paths = {
  artifacts: "/artifacts",
  rekorSearch: "/rekor-search",
  trustRoot: "/trust-root",
  monitoring: "/monitoring",
} as const;

export const AppRoutes = () => {
  const { features } = useFeatureFlags();

  const allRoutes = useRoutes([
    { path: "/", element: <Navigate to={Paths.trustRoot} /> },
    { path: Paths.trustRoot, element: <TrustRoot /> },
    { path: Paths.artifacts, element: <Artifacts /> },
    { path: Paths.rekorSearch, element: <RekorSearch /> },
    ...(features.observability ? [{ path: Paths.monitoring, element: <Monitoring /> }] : []),
    { path: "*", element: <NotFound /> },
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
