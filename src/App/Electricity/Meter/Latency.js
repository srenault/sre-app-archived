import React, { useRef, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { parseISO, differenceInMilliseconds } from 'date-fns';

export default function Latency({ apiClient, label, kind }) {

  const [latency, setLatency] = useState(null);

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {

        if (event.type.startsWith('teleinfo_current') && event.lastUpdate) {
          const lastUpdate = parseISO(event.lastUpdate);
          const now = new Date();
          const value = differenceInMilliseconds(lastUpdate, now);
          const latency = Math.abs(latency);
          setLatency(latency);
        }
      }
    });

    return () => subscription.unsubscribe();
  });

  return (
    <Paper>
      <Typography>Latency</Typography>
      <Typography>{latency} ms</Typography>
    </Paper>
  );
}
