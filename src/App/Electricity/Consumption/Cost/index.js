import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

function formatTime(date) {
  return format(date, 'd MMMM', { locale: frLocale });
}

function round(value) {
  return Math.round(value * 100) / 100;
}

const useStyles = makeStyles((theme) => ({
  table: {
    width: '80%',
    margin: 'auto',
  },
  graph: {
    marginBottom: theme.spacing(2),
  }
}));

export default function Cost({ data }) {
  const chartEl = useRef(null);

  const dates = data.consumption.map(({ date }) => new Date(date));

  const hpCostValues = data.consumption.map(({ hpCost }) => hpCost);

  const hcCostValues = data.consumption.map(({ hcCost }) => hcCost);

  const totalCostValues = data.consumption
        .map(({ hcCost, hpCost }) => round(hcCost + hpCost))
        .filter(cost => cost > 0);

  const meanDailyCost = (() => {
    const sum = totalCostValues.reduce((acc, cost) => acc + cost, 0);
    return round(sum / totalCostValues.length);
  })();

  const maxDailyCost = totalCostValues.reduce((currentMax, cost) => (
    cost > currentMax ? cost : currentMax
  ), 0);

  const minDailyCost = totalCostValues.reduce((currentMin, cost) => (
    cost < currentMin ? cost : currentMin
  ), maxDailyCost);

  const classes = useStyles();

  useEffect(() => {
    const chart = c3.generate({
      padding: {
        right: 20,
      },
      bindto: chartEl.current,
      point: {
        show: false,
      },
      data: {
        type: 'bar',
        types: {
          mean: 'line',
          max: 'line',
          min: 'line',
        },
        x: 'x',
        groups: [
          ['hpCost', 'hcCost'],
        ],
        columns: [
          ['x'].concat(dates),
          ['hpCost'].concat(hpCostValues),
          ['hcCost'].concat(hcCostValues),
          ['max'].concat(Array(dates.length).fill(maxDailyCost)),
          ['mean'].concat(Array(dates.length).fill(meanDailyCost)),
          ['min'].concat(Array(dates.length).fill(minDailyCost)),
        ],
        names: {
          hpCost: 'Coût HP',
          hcCost: 'Coût HC',
          max: 'Coût max.',
          mean: 'Coût moyen',
          min: 'Coût min.',
        },
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: formatTime,
          },
        },
        y: {
          tick: {
            format: (n) => `${n}€`,
          },
        },
      },
    });

    return () => chart.destroy();
  });

  return (
    <>
      <Typography
        gutterBottom="true"
        align="center"
        variant="h3">Coût</Typography>

      <div className={classes.graph} ref={chartEl}></div>

      <Table className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell>Coût total TTC</TableCell>
            <TableCell>{data.totalCost}€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Coût min.</TableCell>
            <TableCell>{minDailyCost}€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Coût moyen</TableCell>
            <TableCell>{meanDailyCost}€</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Coût max.</TableCell>
            <TableCell>{maxDailyCost}€</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}

Cost.propTypes = {
};

Cost.defaultProps = {
};
