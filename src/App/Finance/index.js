import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Subject } from 'rxjs';

import Main from '../Main';
import Header from './Header';
import AccountsOverview from './AccountsOverview';
import Account from './Account';
import { withRoutes } from '../Routes';

function mountAccountsOverview(apiClient) {
  return () => <AccountsOverview apiClient={apiClient} />;
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

function Finance({ apiClient, routePaths }) {
  return (
    <Main>
      <div className="finance">
        <Switch>
          <Route path={routePaths.finance.path} exact={routePaths.finance.exact} component={mountAccountsOverview(apiClient)} />
          <Route path={routePaths.finance.children.account.path} exact={routePaths.finance.exact} component={mountAccount(apiClient)} />
        </Switch>
      </div>
    </Main>
  );
}

export default withRoutes(Finance);
