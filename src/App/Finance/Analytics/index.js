import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import c3 from 'c3';
import { format } from 'date-fns';
import { AsyncStatePropTypes } from '../../../propTypes/react-async';
import withAsyncComponent from '../../../components/AsyncComponent';
import 'c3/c3.css';

import { grouped } from '../../../lib/utils';

const Sort = {
  DESC: (a, b) => new Date(b.startDate) - new Date(a.startDate),
};

function formatDate(date) {
  if (typeof date === 'string') {
    return format(new Date(date), 'dd-MM-yy');
  }
  return format(date, 'dd-MM-yy');
}

function Analytics({ asyncState }) {
  const chartEl = useRef(null);

  const analytics = asyncState.data.result.sort(Sort.DESC);

  const analyticsByPage = (() => {
    const result = grouped(analytics, 5).reverse();
    const [firstGroup, secondGroup, ...restGroups] = result;
    if (firstGroup && firstGroup.length === 1 && secondGroup) {
      const updatedSecondGroup = firstGroup.concat(secondGroup);
      return [updatedSecondGroup, ...restGroups];
    } else {
      return result;
    }
  })();

  const [page, setPage] = useState(analyticsByPage.length - 1);

  const analyticsPeriod = analyticsByPage[page];

  const startPeriod = new Date(analyticsPeriod[0].startDate);

  const endPeriod = new Date(analyticsPeriod[analyticsPeriod.length - 1].endDate);

  const onPreviousPeriod = useCallback(() => setPage(page - 1));

  const onNextPeriod = useCallback(() => setPage(page + 1));

  const overallBalances = analytics.reduce((acc, period) => {
    const [h] = acc;
    const balance = h ? h.balance + period.balance : period.balance;
    return [{ balance, date: period.startDate }, ...acc];
  }, []).reverse();

  const overallBalancesForPeriod = analyticsPeriod.map((period) => {
    const { balance } = overallBalances.find((p) => p.date === period.startDate);
    return balance;
  }).reverse();

  useEffect(() => {
    const xLabels = analyticsPeriod.map((period) => period.startDate);

    const balances = analyticsPeriod.map((period) => period.balance);

    const chart = c3.generate({
      padding: {
        right: 20,
      },
      bindto: chartEl.current,
      data: {
        type: 'area-step',
        types: {
          overallbalances: 'line',
        },
        x: 'x',
        columns: [
          ['x'].concat(xLabels),
          ['balances'].concat(balances),
          ['overallbalances'].concat(overallBalancesForPeriod),
        ],
        labels: true,
      },
      line: {
        step: {
          type: 'step-after',
        },
      },
      legend: {
        show: false,
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: (x) => formatDate(x),
          },
        },
      },
    });

    return () => chart.destroy();
  });

  return (
    <Container>
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <IconButton disabled={page < 1} onClick={onPreviousPeriod}><NavigateBeforeIcon fontSize="large" /></IconButton>
        </Grid>
        <Grid item>
          <Typography align="center" variant="h5">
            {formatDate(startPeriod)} <ArrowRightIcon style={{ verticalAlign: 'text-top' }} /> {formatDate(endPeriod)}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton disabled={page >= analyticsByPage.length - 1} onClick={onNextPeriod}><NavigateNextIcon fontSize="large" /></IconButton>
        </Grid>
      </Grid>
      <div style={{ marginTop: 20, marginBottom: 20 }} ref={chartEl} />
      <Table style={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Date de début</TableCell>
            <TableCell align="center">Date de fin</TableCell>
            <TableCell align="center">Résultat mensuel</TableCell>
            <TableCell align="center">Résultat gobale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyticsPeriod.sort(Sort.DESC).map(({
            startDate, endDate, balance,
          }, index) => {
            const id = `${startDate}#${endDate}`;
            return (
              <TableRow key={id}>
                <TableCell align="center">{formatDate(startDate)}</TableCell>
                <TableCell align="center">{formatDate(endDate)}</TableCell>
                <TableCell align="center">{balance}</TableCell>
                <TableCell align="center">{overallBalancesForPeriod[index]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
}

Analytics.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};

const asyncFetch = ({ apiClient }) => apiClient.finance.fetchAnalytics();

export default withAsyncComponent(asyncFetch)(Analytics);
