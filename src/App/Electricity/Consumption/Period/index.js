import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import Typography from '@material-ui/core/Typography';
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

export default function Period({ data }) {

  const chartEl = useRef(null);

  const dates = data.consumption.map(({ date }) => new Date(date));

  const hcValues = data.consumption.map(({ hc }) => hc);

  const hpValues = data.consumption.map(({ hp }) => hp);

  const totalValues = data.consumption
        .map(({ hc, hp }) => round(hc + hp))
        .filter(value => value > 0);

  const sum = round(totalValues.reduce((acc, value) => acc + value, 0));

  const sumHP = round(hpValues.reduce((acc, value) => acc + value, 0));

  const sumHC = round(hcValues.reduce((acc, value) => acc + value, 0));

  const meanValue = (() => {
    return round(sum / totalValues.length);
  })();

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
        }
      },
      line: {
        step: {
          type: 'step-before',
        }
      },
    });

    return () => chart.destroy();
  });

  return (
    <>
      <Typography
        gutterBottom="true"
        align="center"
        variant="h3">Consommation</Typography>

      <div className={classes.graph} ref={chartEl}></div>

      <Table className={classes.table}>
        <TableBody>
          <TableRow>
            <TableCell>HP Consommation totale</TableCell>
            <TableCell>{sumHP} kWh</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>HC Consommation totale</TableCell>
            <TableCell>{sumHC} kWh</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Consommation min.</TableCell>
            <TableCell>{minValue} kWh</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Consommation moyen</TableCell>
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

Period.propTypes = {
};

Period.defaultProps = {
};
