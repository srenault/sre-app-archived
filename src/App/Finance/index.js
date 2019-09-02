import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { ApiClientPropTypes } from '../../propTypes/models/ApiClient';
import Main from '../Main';
import AccountsOverview from './AccountsOverview';
import Account from './Account';
import { RoutePathsPropTypes } from '../../propTypes/models/Routes';

function mountAccountsOverview(apiClient, routePaths) {
  return () => <AccountsOverview apiClient={apiClient} routePaths={routePaths} />;
}

function mountAccount(apiClient) {
  function RouteAccount({ match }) {
    const { id: accountId, startdate: startDate } = match.params;
    return (
      <Account
        accountId={accountId}
        startDate={startDate}
        apiClient={apiClient}
      />
    );
  }

  RouteAccount.propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
  };

  return RouteAccount;
}

export default function Finance({ apiClient, routePaths }) {
  const accountsOverviewRoute = routePaths.finance.children.accounts;
  const accountRoute = accountsOverviewRoute.children.account;

  return (
    <Main>
      <div className="finance">
        <Switch>
          <Route path={accountsOverviewRoute.path} exact={accountsOverviewRoute.exact} component={mountAccountsOverview(apiClient, routePaths)} />
          <Route path={accountRoute.path} exact={accountRoute.exact} component={mountAccount(apiClient)} />
        </Switch>
      </div>
    </Main>
  );
}

Finance.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
