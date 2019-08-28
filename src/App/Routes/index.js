import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import HomeHeader from '../Home/Header';
import Home from '../Home';
import FinanceHeader from '../Finance/Header';
import Finance from '../Finance';
import ReleasesHeader from '../Releases/Header';
import Releases from '../Releases';
import { buildRoutes, buildRoutePaths, buildNavItems } from './Builder';

let ROUTES = {};
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
    exact: true,
    component: {
      header: () => <FinanceHeader />,
      main: (props) => <Finance {...props} routePaths={ROUTE_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading
    },
    nav: {
      Icon: AccountBalanceIcon,
      label: 'Finance',
    },
    children: {
      account: {
        key: 'finance_account',
        path: '/accounts/:id/:startdate',
        exact: true,
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

ROUTES = buildRoutes(Routes);

ROUTE_PATHS = buildRoutePaths(Routes);

ROUTE_NAV_ITEMS = buildNavItems(Routes);

export function withRoutes(Component) {
  return (props) => (
    <Component
      {...props} // eslint-disable-line react/jsx-props-no-spreading
      routes={ROUTES}
      routePaths={ROUTE_PATHS}
      routeNavItems={ROUTE_NAV_ITEMS}
    />
  );
}

export default {
  withRoutes,
};
