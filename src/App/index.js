import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import { RoutesPropTypes, RoutePathsPropTypes, RouteNavItemsPropTypes } from 'propTypes/models/Routes';
import { withRoutes } from './Routes';
import Nav from './Nav';

function mountComponent(component, apiClient) {
  return (props) => (
    <>
      {component.header()}
      {component.main({ apiClient, ...props })}
    </>
  );
}

const AppRouter = ({
  apiClient, routePaths, routeNavItems, routes,
}) => (
  <Router>
    <Nav routePaths={routePaths} routeNavItems={routeNavItems} />
    <main>
      <Switch>
        {routes.map(({
          key, path, exact, component,
        }) => (
          <Route
            key={key}
            path={path}
            exact={exact || false}
            component={mountComponent(component, apiClient)}
          />
        ))}
      </Switch>
    </main>
  </Router>
);

AppRouter.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
  routeNavItems: RouteNavItemsPropTypes.isRequired,
  routes: RoutesPropTypes.isRequired,
};

export default withRoutes(AppRouter);
