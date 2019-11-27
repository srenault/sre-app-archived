import React from 'react';

import { ApiClientPropTypes } from 'propTypes/models/ApiClient';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import Finance from './index';
import Main from 'App/Main';

export default function FinanceMain({ apiClient, routePaths }) {
  return <Main><Finance apiClient={apiClient} routePaths={routePaths} /></Main>;
}

FinanceMain.propTypes = {
  apiClient: ApiClientPropTypes.isRequired,
  routePaths: RoutePathsPropTypes.isRequired,
};
