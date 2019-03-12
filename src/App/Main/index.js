import React from 'react';
import { Route, Link, Switch } from "react-router-dom";
import Finance from "./Finance";

import "./Main.css";

function Index() {
  return <h2>Home</h2>;
}

export default function Main({ apiClient }) {
  return (
    <main className="dashboard-main">
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/finance/" component={() => <Finance apiClient = { apiClient } />} />
      </Switch>
    </main>
  );
}
