import React, { Fragment, useState } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Subject } from 'rxjs';

import Header from "./Header";
import Main from "./Main";
import Nav from "./Nav";
import { createFinance } from "./Finance";

import './App.css';

const routes = [
  {
    path: "/",
    exact: true,
    component: {
      header: (menuSubscription) => <Header menuSubscription={menuSubscription}>dashboard.sre</Header>,
      main: () => <Main>Home</Main>,
    },
  },
  {
    path: "/finance",
    component: createFinance({ Main }),
  },
];

function mountComponent(component, apiClient, menuSubscription) {
  return (props) => (
    <Fragment>
      {component.header(menuSubscription)}
      {component.main({ apiClient, ...props })}
    </Fragment>
  );
}

const AppRouter = ({ apiClient }) => {
  const menuSubscription = new Subject();

  return (
    <Router>
    <Nav menuSubscription={menuSubscription} />
    <main className="dashboard" id="app-wrap">
    <Switch>
    {routes.map((route, index) => (
      <Route
      key={index}
          path={route.path}
          exact={route.exact || false}
          component={mountComponent(route.component, apiClient, menuSubscription)} />
        ))}
      </Switch>
    </main>
    </Router>
  );
};

export default AppRouter;
