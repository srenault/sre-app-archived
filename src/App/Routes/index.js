import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import HomeHeader from '../Home/Header';
import Home from '../Home';
import FinanceHeader from '../Finance/Header';
import Finance from '../Finance';
import ReleasesHeader from '../Releases/Header';
import Releases from '../Releases';
import { buildRoutes, buildRoutePaths, buildNavItems } from './Builder';

let FLATTEN_ROUTES = {};
let ROUTE_PATHS = {};
let ROUTE_NAV_ITEMS = [];

const Routes = {
  home: {
    key: 'home',
    path: '/',
    exact: true,
    component: {
      header: () => <HomeHeader />,
      main: (props) => <Home {...props} />, // eslint-disable-line react/jsx-props-no-spreading
    },
    nav: {
      Icon: HomeIcon,
      label: 'Home',
    },
    children: {},
  },
  finance: {
    key: 'finance',
    path: '/finance',
    exact: false,
    component: {
      header: () => <FinanceHeader />,
      main: (props) => <Finance {...props} routePaths={ROUTE_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading
    },
    children: {
      accounts: {
        key: 'finance_accounts',
        path: '/accounts',
        exact: true,
        nav: {
          Icon: AccountBalanceIcon,
          label: 'Comptes bancaires',
        },
        children: {
          account: {
            key: 'finance_account',
            path: '/:id/:startdate',
            exact: true,
          },
        },
      },
      analytics: {
        key: 'finance_analytics',
        path: '/analytics',
        exact: true,
        nav: {
          Icon: ShowChartIcon,
          label: 'Analyse des comptes',
        },
        children: {},
      },
    },
  },
  releases: {
    key: 'releases',
    path: '/releases',
    exact: true,
    component: {
      header: () => <ReleasesHeader />,
      main: (props) => <Releases {...props} routePaths={ROUTE_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading
    },
    nav: {
      Icon: SystemUpdateIcon,
      label: 'Mises à jour',
    },
    children: {},
  },
};

FLATTEN_ROUTES = buildRoutes(Routes);
ROUTE_PATHS = buildRoutePaths(Routes);
ROUTE_NAV_ITEMS = buildNavItems(FLATTEN_ROUTES);

export function withRoutes(Component) {
  return (props) => (
    <Component
      {...props} // eslint-disable-line react/jsx-props-no-spreading
      routes={FLATTEN_ROUTES}
      routePaths={ROUTE_PATHS}
      routeNavItems={ROUTE_NAV_ITEMS}
    />
  );
}

export default {
  withRoutes,
};
