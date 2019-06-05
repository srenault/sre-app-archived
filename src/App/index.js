import React, { Fragment } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { withRoutes } from './Routes';
import Nav from './Nav';
import { ApiClientPropTypes } from '../propTypes/models/ApiClient';
import { RoutesPropTypes, RoutePathsPropTypes, RouteNavItemsPropTypes } from '../propTypes/models/Routes';

function mountComponent(component, apiClient) {
  return props => (
    <Fragment>
      {component.header()}
      {component.main({ apiClient, ...props })}
    </Fragment>
  );
}

const AppRouter = ({
  apiClient, routePaths, routeNavItems, routes,
}) => (
  <Router>
    <Nav routePaths={routePaths} routeNavItems={routeNavItems} />
    <main className="dashboard">
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
