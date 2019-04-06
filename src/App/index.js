import React, { Fragment } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

import Nav from "./Nav";
import Header from "./Header";
import Main from "./Main";
import { createFinance } from "./Finance";

import './App.css';

const routes = [
  {
    path: "/",
    exact: true,
    component: {
      nav: () => <Nav />,
      header: () => <Header>dashboard.sre</Header>,
      main: () => <Main>Home</Main>,
    },
  },
  {
    path: "/finance",
    component: createFinance({ Nav, Main }),
  },
];

function mountComponent(component, apiClient) {
  return (props) => (
    <Fragment>
      {component.header()}
      {component.nav()}
      {component.main({ apiClient, ...props })}
    </Fragment>
  );
}

const AppRouter = ({ apiClient }) => (
  <Router>
    <div className="dashboard">
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact || false}
            component={mountComponent(route.component, apiClient)} />
        ))}
      </Switch>
    </div>
  </Router>
)

export default AppRouter;
