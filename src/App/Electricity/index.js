import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import Main from 'App/Main';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import Load from './Load';
import Consumption from './Consumption';
import Meter from './Meter';

function mountLoad(apiClient) {
  return () => <Load apiClient={apiClient} />;
}

function mountConsumption(apiClient) {
  return () => <Consumption apiClient={apiClient} />;
}

function mountMeter(apiClient) {
  return () => <Meter apiClient={apiClient} />;
}

export default function Electricity({ apiClient, routePaths }) {
  const loadRoute = routePaths.electricity.children.load;
  const consumptionRoute = routePaths.electricity.children.consumption;
  const meterRoute = routePaths.electricity.children.meter;

  return (
    <Main>
      <Switch>
        <Route
          path={loadRoute.path}
          exact={loadRoute.exact}
          component={mountLoad(apiClient, routePaths)}
        />

        <Route
          path={consumptionRoute.path}
          exact={consumptionRoute.exact}
          component={mountConsumption(apiClient, routePaths)}
        />

        <Route
          path={meterRoute.path}
          exact={meterRoute.exact}
          component={mountMeter(apiClient, routePaths)}
        />
      </Switch>
    </Main>
  );
}

Electricity.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
