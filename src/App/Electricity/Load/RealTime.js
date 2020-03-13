import React, { useRef, useState, useEffect } from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';

function RealTime({ asyncState, apiClient }) {

  const [currentLoad, setCurrentLoad] = useState(0);

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {
        if (event.type === 'teleinfo_load') {
          setCurrentLoad(event.value);
        }
      }
    });

    return () => subscription.unsubscribe();
  });

  return (
    <div>Real Time {currentLoad}A</div>
  );
}

RealTime.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};

const asyncFetch = ({ apiClient }) => {
  return apiClient.energy.electricity.fetchLatestLoad();
};

export default withAsyncComponent(asyncFetch)(RealTime);
