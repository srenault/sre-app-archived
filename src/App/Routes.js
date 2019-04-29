import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

import HomeHeader from './Home/Header';
import Home from './Home';

import FinanceHeader from './Finance/Header';
import Finance from './Finance';

const Routes = {
  home: {
    key: 'home',
    path: '/',
    exact: true,
    component: {
      header: () => <HomeHeader />,
      main: (props) => <Home {...props} />,
    },
    nav: {
      Icon: HomeIcon,
      label: 'Home',
    },
    children: [],
  },
  finance: {
    key: 'finance',
    path: '/finance',
    exact: true,
    component: {
      header: () => <FinanceHeader />,
      main: (props) => <Finance {...props} />,
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
  }
};

function buildRoutePaths() {
  const step = (routes, acc = {}, parent)  => {
    if (routes && routes.length > 0) {
      const [route, ...otherRoutes] = routes;
      if (route.length === 2) {
        const [routeKey, routeValue] = route;
        const r = parent ? {
          key: routeValue.key,
          path: `${parent.path}${routeValue.path}`,
          exact: !!routeValue.exact,
        } : {
          key: routeValue.key,
          path: routeValue.path,
          exact: !!routeValue.exact,
        };

        const updatedAcc = { ...acc, [routeKey]: r };

        if(routeValue.children && Object.keys(routeValue.children).length > 0) {
          updatedAcc[routeKey].children = step(Object.entries(routeValue.children), {}, r);
          return step(otherRoutes, updatedAcc);
        } else {
          return step(otherRoutes, updatedAcc);
        }
      } else {
        return acc;
      }
    } else {
      return acc;
    }
  };

  return step(Object.entries(Routes));
}

function buildRoutes() {
  const step = (routes, acc = [], parent) => {
    if (routes && routes.length > 0) {
      const [route, ...otherRoutes] = routes;
      if (route) {
        const r = parent ? {
          key: route.key,
          path: `${parent.path}${route.path}`,
          exact: route.exact || false,
          component: {
            ...parent.component,
            ...route.component
          }
        } : route;

        const updatedAcc = acc.concat(r);

        if (route.children && Object.keys(route.children).length > 0) {
          return step(otherRoutes, step(Object.values(route.children), updatedAcc, r));
        } else {
          return step(otherRoutes, updatedAcc);
        }
      } else {
        return acc;
      }
    } else {
      return acc;
    }
  };
  return step(Object.values(Routes));
}

function buildNavItems() {
  return Object.entries(Routes)
    .filter(([, { nav }]) => !!nav)
    .map(([, { path, key, nav }]) => ({ path, key, ...nav }));
}

const routes = buildRoutes();

const routePaths = buildRoutePaths();

const routeNavItems = buildNavItems();

export function withRoutes(Component) {
  return (props) => <Component {...props} routes={routes} routePaths={routePaths} routeNavItems={routeNavItems} />;
}

export default {
  withRoutes,
}
