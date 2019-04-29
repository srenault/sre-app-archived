import React, { Fragment, useState } from 'react';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';

import { withRoutes } from './Routes';
import Nav from './Nav';

import './App.css';

function mountComponent(component, apiClient) {
  return (props) => (
    <Fragment>
      {component.header()}
      {component.main({ apiClient, ...props })}
    </Fragment>
  );
}

const AppRouter = ({ apiClient, routePaths, routeNavItems, routes }) => {
  return (
    <Router>
      <Nav routePaths={routePaths} routeNavItems={routeNavItems} />
      <main className="dashboard">
        <Switch>
          {routes.map(({ key, path, exact, component }) => (
            <Route
              key={key}
              path={path}
              exact={exact || false}
              component={mountComponent(component, apiClient)} />
          ))}
        </Switch>
      </main>
    </Router>
  );
};

export default withRoutes(AppRouter);
