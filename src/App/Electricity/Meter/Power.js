import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function Power({ apiClient, label, kind }) {
  const eventType = (() => {
    switch (kind) {
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
      },
    });

    return () => subscription.unsubscribe();
  });

  return (
    <Card>
      <CardContent>
        <Typography align="center" variant="h6">{label}</Typography>
        <Typography align="center">{power ? `${power} kWh` : 'N/A'}</Typography>
      </CardContent>
    </Card>
  );
}
