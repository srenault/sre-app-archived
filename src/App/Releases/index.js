import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import Main from 'App/Main';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import ReleasesOverview from './ReleasesOverview';

function mountReleasesOverview(apiClient, routePaths) {
  return () => <ReleasesOverview apiClient={apiClient} routePaths={routePaths} />;
}

export default function Releases({ apiClient, routePaths }) {
  return (
    <Main>
      <div className="releases">
        <Switch>
          <Route
            path={routePaths.releases.path}
            exact={routePaths.releases.exact}
            component={mountReleasesOverview(apiClient, routePaths)}
          />
        </Switch>
      </div>
    </Main>
  );
}

Releases.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
