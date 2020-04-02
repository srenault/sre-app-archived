import React from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import Period from './Period';
import Cost from './Cost';

function Graphs({ asyncState }) {
  return (
    <>
      <Period data={asyncState.data} />
      <Cost data={asyncState.data} />
    </>
  );
}

const asyncFetch = ({ apiClient, startDate, endDate }) => {
  console.log(startDate, endDate);
  return apiClient.energy.electricity.fetchConsumption(startDate, endDate);
};

export default withAsyncComponent(asyncFetch)(Graphs);


Graphs.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};