import * as React from 'react';

import { Layout } from '@strapi/design-system';
import { LoadingIndicatorPage, useStrapiApp } from '@strapi/helper-plugin';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';

import { useEnterprise } from '../../hooks/useEnterprise';
import { useSettingsMenu } from '../../hooks/useSettingsMenu';

import { SettingsNav } from './components/SettingsNav';
import { ROUTES_CE, Route as IRoute } from './constants';
import { ApplicationInfoPage } from './pages/ApplicationInfo/ApplicationInfoPage';

const SettingsPage = () => {
  const { settingId } = useParams<{ settingId: string }>();
  const { settings } = useStrapiApp();
  const { formatMessage } = useIntl();
  const { isLoading, menu } = useSettingsMenu();
  const routes = useEnterprise(
    ROUTES_CE,
    async () => (await import('../../../../ee/admin/src/pages/SettingsPage/constants')).ROUTES_EE,
    {
      combine(ceRoutes, eeRoutes) {
        return [...ceRoutes, ...eeRoutes];
      },
      defaultValue: [],
    }
  );

  // Since the useSettingsMenu hook can make API calls in order to check the links permissions
  // We need to add a loading state to prevent redirecting the user while permissions are being checked
  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  if (!settingId) {
    return <Navigate to="/application-infos" />;
  }

  return (
    <Layout sideNav={<SettingsNav menu={menu} />}>
      <Helmet
        title={formatMessage({
          id: 'global.settings',
          defaultMessage: 'Settings',
        })}
      />

      <Routes>
        <Route path="/application-infos">
          <ApplicationInfoPage />
        </Route>
        {makeUniqueRoutes(routes).map(({ to, Component }) => (
          <Route key={to} path={to}>
            <React.Suspense fallback={<LoadingIndicatorPage />}>
              <Component />
            </React.Suspense>
          </Route>
        ))}
        {Object.values(settings).flatMap(({ links }) =>
          links.map((link) => {
            return (
              <Route key={link.id} path={link.to}>
                <React.Suspense fallback={<LoadingIndicatorPage />}>
                  <link.Component />
                </React.Suspense>
              </Route>
            );
          })
        )}
      </Routes>
    </Layout>
  );
};

export const makeUniqueRoutes = (routes: IRoute[]) =>
  routes.filter(
    (route, index, refArray) => refArray.findIndex((obj) => obj.to === route.to) === index
  );

export { SettingsPage };
