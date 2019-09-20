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

let ROUTES = {};
let ROUTES_PATHS = {};
let ROUTES_NAV_ITEMS = [];

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
    ignore: true,
    component: {
      header: () => <FinanceHeader refresh />,
      main: (props) => <Finance {...props} routePaths={ROUTES_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading
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
        component: {
          header: () => <FinanceHeader />,
        },
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
      main: (props) => <Releases {...props} routePaths={ROUTES_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading
    },
    nav: {
      Icon: SystemUpdateIcon,
      label: 'Mises à jour',
    },
    children: {},
  },
};

ROUTES = buildRoutes(Routes);

ROUTES_PATHS = buildRoutePaths(Routes);

ROUTES_NAV_ITEMS = buildNavItems(Routes);

export function withRoutes(Component) {
  return (props) => (
    <Component
      {...props} // eslint-disable-line react/jsx-props-no-spreading
      routes={ROUTES}
      routePaths={ROUTES_PATHS}
      routeNavItems={ROUTES_NAV_ITEMS}
    />
  );
}

export default {
  withRoutes,
};
