import React, { useRef, useState, useEffect } from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import { parseISO, format, differenceInMilliseconds } from 'date-fns';
import Gauge from 'components/Gauge';

function RealTime({ asyncState, apiClient }) {

  const [currentLoad, setCurrentLoad] = useState({ value: 0, lastUpdate: new Date() });

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {
        if (event.type === 'teleinfo_load') {
          const lastUpdate = parseISO(event.lastUpdate);
          setCurrentLoad({ value: event.value, lastUpdate });
        }
      }
    });

    return () => subscription.unsubscribe();
  });

  const lastUpdate = format(currentLoad.lastUpdate, 'HH:mm');
  const latency = differenceInMilliseconds(new Date(), currentLoad.lastUpdate);

  return (
    <Gauge
      label={`Charge (+${latency}ms)`}
      value={currentLoad.value}
      threshold={100}
      format={(value) => `${value}%`} />
  );
}

RealTime.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};

const asyncFetch = ({ apiClient }) => {
  return apiClient.energy.electricity.fetchLatestLoad();
};

export default withAsyncComponent(asyncFetch)(RealTime);
