import React, { useRef, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

export default function Current({ apiClient, label, kind }) {

  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {

        if (event.type === 'teleinfo_current') {
          setCurrent(event.value);
        }
      }
    });

    return () => subscription.unsubscribe();
  });

  return (
    <Paper>
      <Typography>Current</Typography>
      <Typography>{current} A</Typography>
    </Paper>
  );
}
