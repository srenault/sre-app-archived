import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import PowerIcon from '@material-ui/icons/Power';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import FireplaceIcon from '@material-ui/icons/Fireplace';
import HomeHeader from 'App/Home/Header';
import Home from 'App/Home';
import FinanceHeader from 'App/Finance/Header';
import Finance from 'App/Finance';
import ReleasesHeader from 'App/Releases/Header';
import Releases from 'App/Releases';
import ElectricityHeader from 'App/Electricity/Header';
import Electricity from 'App/Electricity';
import Heaters from 'App/Heaters';
import HeatersHeader from 'App/Heaters/Header';
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
  electricity: {
    key: 'electricity',
    path: '/electricity',
    exact: false,
    ignore: true,
    component: {
      main: (props) => <Electricity {...props} routePaths={ROUTES_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading,
      header: () => <ElectricityHeader refresh />,
    },
    children: {
      consumption: {
        key: 'electricity_consumption',
        path: '/consumption',
        exact: true,
        nav: {
          Icon: DataUsageIcon,
          label: 'Consommation élec.',
        },
      },
      load: {
        key: 'electricity_load',
        path: '/load',
        exact: true,
        nav: {
          Icon: PowerIcon,
          label: 'Charge',
        },
      },
      meter: {
        key: 'electricity_meter',
        path: '/meter',
        exact: true,
        nav: {
          Icon: NetworkCheckIcon,
          label: 'Compteur temps réel',
        },
      },
    },
  },
  heaters: {
    key: 'heaters',
    path: '/heaters',
    exact: true,
    nav: {
      Icon: FireplaceIcon,
      label: 'Chauffages',
    },
    component: {
      header: () => <HeatersHeader refresh />,
      main: (props) => <Heaters {...props} routePaths={ROUTES_PATHS} />, // eslint-disable-line react/jsx-props-no-spreading,
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
