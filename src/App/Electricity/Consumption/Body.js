import React from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DailyUsage from './DailyUsage';

const useStyles = makeStyles((theme) => ({
  cards: {
    marginBottom: theme.spacing(6),
  },
}));

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function Body({ asyncState }) {
  const { totalCost, totalCostWithTaxes } = asyncState.data;
  const {
    dailyUsage,
    startHcCounter,
    endHcCounter,
    startHpCounter,
    endHpCounter,
  } = asyncState.data.consumption;

  const hpTotalUsage = endHpCounter - startHpCounter;

  const hcTotalUsage = endHcCounter - startHcCounter;

  const classes = useStyles();

  return (
    <>
      <Grid className={classes.cards} container justify="center" spacing={2}>
        <Grid item key="cost">
          <Card>
            <CardContent>
              <Typography variant="h6">
                Coût
              </Typography>
              <Typography variant="h3">
                {totalCost}€
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item key="cost-with-taxes">
          <Card>
            <CardContent>
              <Typography variant="h6">
                Coût taxes inclus
              </Typography>
              <Typography variant="h3">
                {totalCostWithTaxes}€
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item key="hp-consumption">
          <Card>
            <CardContent>
              <Typography variant="h6">
                Consommation HP
              </Typography>
              <Typography variant="h3">
                {round(hpTotalUsage)} kWh
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item key="hc-consumption">
          <Card>
            <CardContent>
              <Typography variant="h6">
                Consommation HC
              </Typography>
              <Typography variant="h3">
                {round(hcTotalUsage)} kWh
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <DailyUsage dailyUsage={dailyUsage} />
    </>
  );
}

const asyncFetch = ({ apiClient, startDate, endDate }) => (
  apiClient.energy.electricity.fetchConsumption(startDate, endDate)
);

export default withAsyncComponent(asyncFetch)(Body);
