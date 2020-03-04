import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import Main from 'App/Main';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import Electricity from './Electricity';

function mountElectricity(apiClient, routePaths) {
  return () => <Electricity apiClient={apiClient} routePaths={routePaths} />;
}

export default function Energy({ apiClient, routePaths }) {
  const electricityRoute = routePaths.energy.children.electricity;
  return (
    <Main>
      <div className="finance">
        <Switch>
          <Route
            path={electricityRoute.path}
            exact={electricityRoute.exact}
            component={mountElectricity(apiClient, routePaths)} />
        </Switch>
      </div>
    </Main>
  );
}

Energy.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
