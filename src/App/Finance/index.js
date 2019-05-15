import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Main from '../Main';
import AccountsOverview from './AccountsOverview';
import Account from './Account';

function mountAccountsOverview(apiClient, routePaths) {
  return () => <AccountsOverview apiClient={apiClient} routePaths={routePaths} />;
}

function mountAccount(apiClient) {
  return ({ match }) => {
    const { id: accountId, startdate: startDate } = match.params;
    return (
      <Account
        accountId={accountId}
        startDate={startDate}
        apiClient={apiClient}
      />
    );
  };
}

export default function Finance({ apiClient, routePaths }) {
  return (
    <Main>
      <div className="finance">
        <Switch>
          <Route path={routePaths.finance.path} exact={routePaths.finance.exact} component={mountAccountsOverview(apiClient, routePaths)} />
          <Route path={routePaths.finance.children.account.path} exact={routePaths.finance.exact} component={mountAccount(apiClient)} />
        </Switch>
      </div>
    </Main>
  );
}
