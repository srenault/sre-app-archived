import React, { useRef, useEffect, useState } from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import Container from '@material-ui/core/Container';
import LastHour from './LastHour';
import LatestHours from './LatestHours';

function Past({ asyncState, apiClient }) {
  return (
    <Container>
      <LastHour data={asyncState.data} />
      <LatestHours data={asyncState.data} />
    </Container>
  );
}

Past.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};

const asyncFetch = ({ apiClient }) => {
  return apiClient.energy.electricity.fetchLatestLoad();
};

export default withAsyncComponent(asyncFetch)(Past);
