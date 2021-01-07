import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import Main from 'App/Main';
import Manage from './Manage';

export default function Heaters({ apiClient, routePaths }) {
  return (
    <Main>
      <div className="heaters">
        <Switch>
          <Route
            path={routePaths.heaters.path}
            exact={routePaths.heaters.exact}
            component={() => <Manage apiClient={apiClient} />}
          />
        </Switch>
      </div>
    </Main>
  );
}

Heaters.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
