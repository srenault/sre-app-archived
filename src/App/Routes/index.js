import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import PowerIcon from '@material-ui/icons/Power';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import HomeHeader from 'App/Home/Header';
import Home from 'App/Home';
import FinanceHeader from 'App/Finance/Header';
import Finance from 'App/Finance';
import ReleasesHeader from 'App/Releases/Header';
import Releases from 'App/Releases';
import ElectricityHeader from 'App/Energy/Electricity/Header';
import Energy from 'App/Energy';
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
            path: '/:id',
            exact: true,
          },
        },
      },
      analytics: {
        key: 'finance_analytics',
        path: '/analytics',
        exact: true,
        component: {
          header: () => <FinanceHeader refreshIndex />,
        },
        nav: {
          Icon: ShowChartIcon,
          label: 'Analyse des comptes',
        },
        children: {
          period: {
            key: 'finance_analytics_period',
            path: '/period/:periodDate',
            exact: true,
            component: {
              header: () => <FinanceHeader />,
            },
          },
        },
      },
    },
  },
  energy: {
    key: 'energy',
    path: '/energy',
    exact: false,
    ignore: true,
    component: {
      main: (props) => <Energy {...props} routePaths={ROUTES_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading
    },
    children: {
      electricity: {
        key: 'energy_electricity',
        path: '/electricity',
        exact: true,
        nav: {
          Icon: PowerIcon,
          label: 'Electricité',
        },
        component: {
          header: () => <ElectricityHeader refresh />,
        },
        children: {
          account: {
            key: 'finance_account',
            path: '/:id',
            exact: true,
          },
        },
      }
    }
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
