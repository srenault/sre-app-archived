import React from 'react';

import { AsyncStatePropTypes } from 'propTypes/react-async';
import withAsyncComponent from 'components/AsyncComponent';
import Statements from 'components/Statements';

function AnalyticsPeriod({ asyncState }) {
  const { period, statements } = asyncState.data;
  return <Statements period={period} statements={statements} />;
}

const asyncFetch = ({ apiClient, periodDate }) => apiClient.finance.fetchAnalyticsPeriod(periodDate);

export default withAsyncComponent(asyncFetch)(AnalyticsPeriod);

AnalyticsPeriod.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};
