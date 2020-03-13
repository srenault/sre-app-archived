import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import Main from 'App/Main';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import Load from './Load';
import Consumption from './Consumption';

function mountLoad(apiClient, routePaths) {
  return () => <Load apiClient={apiClient} />;
}

function mountConsumption(apiClient, routePaths) {
  return () => <Consumption apiClient={apiClient} />;
}

export default function Electricity({ apiClient, routePaths }) {
  const loadRoute = routePaths.electricity.children.load;
  const consumptionRoute = routePaths.electricity.children.consumption;

  return (
    <Main>
      <Switch>
        <Route
          path={loadRoute.path}
          exact={loadRoute.exact}
          component={mountLoad(apiClient, routePaths)} />

        <Route
          path={consumptionRoute.path}
          exact={consumptionRoute.exact}
          component={mountConsumption(apiClient, routePaths)} />
      </Switch>
    </Main>
  );
}

Electricity.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
