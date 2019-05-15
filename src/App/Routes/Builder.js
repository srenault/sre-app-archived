export function buildRoutePaths(Routes) {
  const step = (routes, acc = {}, parent) => {
    if (routes && routes.length > 0) {
      const [route, ...otherRoutes] = routes;
      if (route.length === 2) {
        const [routeKey, routeValue] = route;
        const path = parent ? `${parent.path}${routeValue.path}` : routeValue.path;
        const reversePath = (args) => {
          const params = path.match(/:([^/]+)/g);
          return Object.entries(args).reduce((routesAcc, [argKey, argValue]) => {
            if (params.some(param => param === `:${argKey}`)) {
              return routesAcc.replace(`:${argKey}`, argValue);
            } else {
              return routesAcc;
            }
          }, path);
        };

        const r = parent ? {
          key: routeValue.key,
          path,
          reversePath,
          exact: !!routeValue.exact,
        } : {
          key: routeValue.key,
          path,
          reversePath,
          exact: !!routeValue.exact,
        };

        const updatedAcc = { ...acc, [routeKey]: r };

        if (routeValue.children && Object.keys(routeValue.children).length > 0) {
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

export function buildRoutes(Routes) {
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
            ...route.component,
          },
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

export function buildNavItems(Routes) {
  return Object.entries(Routes)
    .filter(([, { nav }]) => !!nav)
    .map(([, { path, key, nav }]) => ({ path, key, ...nav }));
}

export default {
  buildRoutes,
  buildRoutePaths,
  buildNavItems,
};
