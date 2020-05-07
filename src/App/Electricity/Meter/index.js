import React from 'react';
import Container from '@material-ui/core/Container';
import Power from './Power';
import Current from './Current';
import Latency from './Latency';
import CurrentGraph from './CurrentGraph';
import Grid from '@material-ui/core/Grid';

export default function Meter({ apiClient }) {

  return (
    <Container>
      <Grid justify="space-around" container>
        <Grid item>
          <Latency apiClient={apiClient} />
        </Grid>

        <Grid item>
          <Current apiClient={apiClient} />
        </Grid>

        <Grid item>
          <Power apiClient={apiClient} label="HP" kind="hp" />
        </Grid>

        <Grid item>
          <Power apiClient={apiClient} label="HC" kind="hc" />
        </Grid>
      </Grid>
      <CurrentGraph apiClient={apiClient} />
    </Container>
  );
}
