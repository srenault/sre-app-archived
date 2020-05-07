import React, { useRef, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

export default function Power({ apiClient, label, kind }) {

  const eventType = (() => {
    switch(kind) {
      case 'hp': return 'teleinfo_power_hp';
      case 'hc': return 'teleinfo_power_hc';
      default: throw new Error(`Unexpected kind ${kind}`);
    }
  })();

  const [power, setPower] = useState(null);

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {

        if (event.type === eventType) {
          setPower(event.value);
        }
      }
    });

    return () => subscription.unsubscribe();
  });

  return (
    <Paper>
      <Typography>{label}</Typography>
      <Typography>{power} kWh</Typography>
    </Paper>
  );
}
