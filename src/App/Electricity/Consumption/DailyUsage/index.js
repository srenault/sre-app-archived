import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
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
    marginBottom: theme.spacing(2),
  },
  graph: {
    marginBottom: theme.spacing(2),
  },
}));

export default function DailyUsage({ dailyUsage }) {
  const chartEl = useRef(null);

  const dates = dailyUsage.map(({ date }) => new Date(date));

  const hcValues = dailyUsage.map(({ hc }) => hc);

  const hpValues = dailyUsage.map(({ hp }) => hp);

  const totalValues = dailyUsage
    .map(({ hc, hp }) => round(hc + hp))
    .filter((value) => value > 0);

  const sum = round(totalValues.reduce((acc, value) => acc + value, 0));

  const meanValue = (() => round(sum / totalValues.length))();

  const maxValue = totalValues.reduce((currentMax, value) => (
    value > currentMax ? value : currentMax
  ), 0);

  const minValue = totalValues.reduce((currentMin, value) => (
    value < currentMin ? value : currentMin
  ), maxValue);

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
          ['hp', 'hc'],
        ],
        columns: [
          ['x'].concat(dates),
          ['hp'].concat(hpValues),
          ['hc'].concat(hcValues),
          ['max'].concat(Array(dates.length).fill(maxValue)),
          ['mean'].concat(Array(dates.length).fill(meanValue)),
          ['min'].concat(Array(dates.length).fill(minValue)),
        ],
        names: {
          hp: 'Consommation HP',
          hc: 'Consommation HC',
          max: 'Consommation max.',
          mean: 'Consommation moyenne',
          min: 'Consommation min.',
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
            format: (n) => `${n}kWh`,
          },
        },
      },
      line: {
        step: {
          type: 'step-before',
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
        variant="h4"
      >Consommation journalière
      </Typography>

      <div className={classes.graph} ref={chartEl} />

      <Table className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell>Consommation min.</TableCell>
            <TableCell>{minValue} kWh</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Consommation moyenne</TableCell>
            <TableCell>{meanValue} kWh</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Consommation max.</TableCell>
            <TableCell>{maxValue} kWh</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
