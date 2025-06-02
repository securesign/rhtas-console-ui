import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';
import { TrustRootsPage } from './Trust/TrustRoots/TrustRootsPage';
import { TrustOverview } from './Trust/Overview/TrustOverview';
import { ArtifactsPage } from './Artifacts/ArtifactsPage';
import { CertificatesPage } from './Trust/Certificates/CertificatesPage';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    label: 'Trust',
    routes: [
      {
        element: <TrustOverview />,
        exact: true,
        label: 'Overview',
        // path: '/trust/overview',
        path: '/',
        title: 'Overview'
      },
      {
        element: <CertificatesPage />,
        exact: true,
        label: 'Certificates',
        path: '/trust/certificates',
        title: 'Certificates'
      },
      {
        element: <TrustRootsPage />,
        exact: true,
        label: 'Trust Roots',
        path: '/trust/roots',
        title: 'Trust Roots'
      }
    ]
  },
  {
    element: <ArtifactsPage />,
    exact: true,
    label: 'Artifacts',
    path: '/artifacts',
    title: 'Artifacts',
  },
  {
    label: 'Settings',
    routes: [
      {
        element: <GeneralSettings />,
        exact: true,
        label: 'General',
        path: '/settings/general',
        title: 'General Settings',
      },
      {
        element: <ProfileSettings />,
        exact: true,
        label: 'Profile',
        path: '/settings/profile',
        title: 'Profile Settings',
      },
    ],
  },
  {
    element: <Dashboard />,
    exact: true,
    label: 'Dashboard',
    path: '/dashboard',
    title: 'RHTAS Console UI',
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
