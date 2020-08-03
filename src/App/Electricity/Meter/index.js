import React, { useState, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import Power from './Power';
import Current from './Current';
import CurrentGraph from './CurrentGraph';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  cards: {
    marginBottom: theme.spacing(6),
  },
}));

export default function Meter({ apiClient }) {

  const classes = useStyles();

  const [currentGraph, setCurrentGraph] = useState({ pause: false, show: false });

  const onCurrentStop = useCallback(() => setCurrentGraph({ pause: false, show: false }), []);

  const onCurrentStart = useCallback(() => setCurrentGraph({ pause: false, show: true }), []);

  const onCurrentPause = useCallback(() => setCurrentGraph({ pause: true, show: true }), []);

  return (
    <Container>
      <Grid className={classes.cards} justify="space-around" alignItems="center" container spacing="3">
        <Grid item xs="6" className={classes.cardItem}>
          <Power apiClient={apiClient} label="HP" kind="hp" />
        </Grid>

        <Grid item xs="6">
          <Power apiClient={apiClient} label="HC" kind="hc" />
        </Grid>

        <Grid item xs="12">
          <Current
            apiClient={apiClient}
            onStop={onCurrentStop}
            onStart={onCurrentStart}
            onPause={onCurrentPause} />
        </Grid>
      </Grid>
      { currentGraph.show && <CurrentGraph apiClient={apiClient} pause={currentGraph.pause} /> }
    </Container>
  );
}
