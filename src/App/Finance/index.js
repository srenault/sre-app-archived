import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import Main from 'App/Main';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import AccountsOverview from './AccountsOverview';
import Account from './Account';
import Analytics from './Analytics';

function mountAccountsOverview(apiClient, routePaths) {
  return () => <AccountsOverview apiClient={apiClient} routePaths={routePaths} />;
}

function mountAccount(apiClient) {
  function RouteAccount({ match, location }) {
    const { id: accountId } = match.params;
    const qs = new URLSearchParams(location.search);
    const periodDate = qs.get('periodDate');

    return (
      <Account
        accountId={accountId}
        periodDate={periodDate}
        apiClient={apiClient}
      />
    );
  }

  RouteAccount.propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
  };

  return RouteAccount;
}

function mountAnalytics(apiClient) {
  return () => <Analytics apiClient={apiClient} />;
}

export default function Finance({ apiClient, routePaths }) {
  const accountsOverviewRoute = routePaths.finance.children.accounts;
  const accountRoute = accountsOverviewRoute.children.account;
  const analyticsRoute = routePaths.finance.children.analytics;

  return (
    <Main>
      <div className="finance">
        <Switch>
          <Route path={accountsOverviewRoute.path} exact={accountsOverviewRoute.exact} component={mountAccountsOverview(apiClient, routePaths)} />
          <Route path={accountRoute.path} exact={accountRoute.exact} component={mountAccount(apiClient)} />
          <Route path={analyticsRoute.path} exact={analyticsRoute.exact} component={mountAnalytics(apiClient)} />
        </Switch>
      </div>
    </Main>
  );
}

Finance.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
