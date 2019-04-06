import React from 'react';
import { Route, Switch } from "react-router-dom";
import { Subject } from 'rxjs';

import Header from "./Header";
import AccountsOverview from './AccountsOverview';
import Account from './Account';

function AccountView(apiClient, refreshSubscription) {
  return ({ match }) => {
    const accountId = match.params.id;
    return (
      <Account
        accountId={accountId}
        apiClient={apiClient}
        refreshSubscription={refreshSubscription}
        />
    );
  };
}

function Finance({ match, apiClient, refreshSubscription }) {
  return (
      <div className="finance">
        <Switch>
          <Route path={match.url} exact component={() => <AccountsOverview apiClient={apiClient} refreshSubscription={refreshSubscription} />} />
          <Route path={`${match.url}/accounts/:id`} component={AccountView(apiClient, refreshSubscription)} />
        </Switch>
      </div>
  );
}

export function createFinance({ Nav, Main }) {
  const refreshSubscription = new Subject();
  return {
    nav: () => <Nav isFinance />,
    header: () => <Header refreshSubscription={refreshSubscription} />,
    main: (props) => (
      <Main><Finance refreshSubscription={refreshSubscription} {...props} /></Main>
    ),
  };
};
