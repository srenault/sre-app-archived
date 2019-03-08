import React from 'react';
import { Route, Link, Switch } from "react-router-dom";
import Money from "./Money";

import "./Main.css";

function Index() {
  return <h2>Home</h2>;
}

export default function Main() {
  return (
    <main className="dashboard-main">
      <Switch>
        <Route path="/" exact component={Index} />
        <Route path="/money/" component={Money} />
      </Switch>
    </main>
  );
}
