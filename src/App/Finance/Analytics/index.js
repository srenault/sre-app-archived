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
import { withRouter } from 'react-router-dom';
import c3 from 'c3';
import { format, isAfter, isBefore } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import { RoutePathsPropTypes } from 'propTypes/models/Routes';
import ReactRouterPropTypes from 'react-router-prop-types';
import withAsyncComponent from 'components/AsyncComponent';
import { grouped } from 'lib/utils';

import 'c3/c3.css';

function formatDate(date) {
  if (typeof date === 'string') {
    return format(new Date(date), 'dd-MM-yy');
  }
  return format(date, 'dd-MM-yy');
}

function Analytics({ asyncState, routePaths, history, location }) {
  const chartEl = useRef(null);

  const {
    result: periods,
    hasPreviousPage,
    hasNextPage,
  } = asyncState.data;

  const qs = new URLSearchParams(location.search);

  const [previousButtonDisabled, nextButtonDisabled] = (() => {
    const qs = new URLSearchParams(location.search);
    const afterParam = qs.get('after');
    const beforeParam = qs.get('before');
    const hasFilter =  afterParam || beforeParam;
    if (beforeParam || !hasFilter) {
      return [!hasNextPage, !hasPreviousPage];
    } else {
      return [!hasPreviousPage, !hasNextPage];
    }
  })();

  const headPeriod = periods[0];

  const headPeriodDate = new Date(headPeriod.yearMonth);

  const lastPeriod = periods[periods.length - 1];

  const lastPeriodDate = new Date(lastPeriod.yearMonth);

  const startPeriod = isBefore(headPeriodDate, lastPeriodDate) ? headPeriod : lastPeriod;

  const endPeriod = isAfter(headPeriodDate, lastPeriodDate) ? headPeriod : lastPeriod;

  const onPreviousPeriod = useCallback(() => {
    history.push({
      search: `?before=${startPeriod.yearMonth}`,
    });
  }, [headPeriod.yearMonth]);

  const onNextPeriod = useCallback(() => {
    history.push({
      search: `?after=${endPeriod.yearMonth}`,
    });
  }, [headPeriod.yearMonth]);

  const overallResults = periods.reduce((acc, period) => {
    const [h] = acc;
    const result = h ? h.result + period.result : period.result;
    return [{ result, date: period.startDate }, ...acc];
  }, []).reverse();

  const overallBalances = periods.map(period => {
    return Object.values(period.balancesByAccount).reduce((acc, balance) => {
      return acc + balance;
    }, 0);
  });

  useEffect(() => {
    const xLabels = periods.map((period) => period.startDate);

    const results = periods.map((period) => period.result);

    const chart = c3.generate({
      padding: {
        right: 20,
      },
      bindto: chartEl.current,
      data: {
        types: {
          balance: 'spline',
        },
        x: 'x',
        columns: [
          ['x'].concat(xLabels),
          ['balance'].concat(overallBalances),
        ],
        labels: true,
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

  const onPeriodClick = useCallback(({ periodDate }) => () => {
    const url = routePaths.finance.children.analytics.children.period.reversePath({ periodDate });
    history.push(url);
  }, []);

  return (
    <Container>
      <Grid container justify="center" alignItems="center">
        <Grid item>
          <IconButton disabled={previousButtonDisabled} onClick={onPreviousPeriod}><NavigateBeforeIcon fontSize="large" /></IconButton>
        </Grid>
        <Grid item>
          <Typography align="center" variant="h6">
            {startPeriod.yearMonth} <ArrowRightIcon style={{ verticalAlign: 'middle' }} /> {endPeriod.yearMonth}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton disabled={nextButtonDisabled} onClick={onNextPeriod}><NavigateNextIcon fontSize="large" /></IconButton>
        </Grid>
      </Grid>
      <div style={{ marginTop: 20, marginBottom: 20 }} ref={chartEl} />
      <Table style={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Période</TableCell>
            <TableCell align="center">Balance</TableCell>
            <TableCell align="center">Résultat mensuel</TableCell>
            <TableCell align="center">Résultat gobale {periods[0] ? `depuis le ${periods[0].startDate}` : ''}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {periods.map(({ result, yearMonth }, index) => {
            const balance = overallBalances[index];
            const overallResult = overallResults[index].result;
            return (
              <TableRow key={yearMonth} onClick={onPeriodClick({ yearMonth })}>
                <TableCell align="center">{yearMonth}</TableCell>
                <TableCell align="center">{balance}</TableCell>
                <TableCell align="center">{result}</TableCell>
                <TableCell align="center">{overallResult}</TableCell>
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
  routePaths: RoutePathsPropTypes.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

const asyncFetch = ({ apiClient, location }) => {
  const qs = new URLSearchParams(location.search);
  const beforePeriod = qs.get('before');
  const afterPeriod = qs.get('after');
  return apiClient.finance.fetchAnalytics(beforePeriod, afterPeriod);
}

export default withAsyncComponent(asyncFetch)(withRouter(Analytics));
