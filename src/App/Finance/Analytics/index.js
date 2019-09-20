import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import c3 from 'c3';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';

import 'c3/c3.css';

import { AsyncStatePropTypes } from '../../../propTypes/react-async';
import withAsyncComponent from '../../../components/AsyncComponent';
import { grouped } from '../../../lib/utils';

const Sort = {
  DESC: (a, b) => new Date(b.startDate) - new Date(a.startDate),
};

function formatPeriodDate(date) {
  return format(date, 'dd-MM-yy', { locale: frLocale });
}

function Analytics({ asyncState }) {
  const chartEl = useRef(null);

  const analytics = asyncState.data.result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

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

  useEffect(() => {
    const xLabels = analyticsPeriod.map((period) => period.startDate);

    const values = analyticsPeriod.map((period) => period.balance);

    const chart = c3.generate({
      padding: {
        right: 20,
      },
      bindto: chartEl.current,
      data: {
        type: 'area-step',
        x: 'x',
        columns: [
          ['x'].concat(xLabels),
          ['balances'].concat(values),
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
            format: (x) => format(x, 'd-MM-yy'),
          },
        },
      },
    });

    return () => chart.destroy();
  });

  return (
    <Container>
      <Grid container justify="center" alignItems="center">
        <Grid item>
          <IconButton disabled={page < 1} onClick={onPreviousPeriod}><NavigateBeforeIcon /></IconButton>
        </Grid>
        <Grid item>
          <Typography align="center" variant="h5">
            {formatPeriodDate(startPeriod)} <ArrowRightIcon style={{ verticalAlign: 'text-top' }} /> {formatPeriodDate(endPeriod)}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton disabled={page >= analyticsByPage.length - 1} onClick={onNextPeriod}><NavigateNextIcon /></IconButton>
        </Grid>
      </Grid>
      <div style={{ marginTop: 20, marginBottom: 20 }} ref={chartEl} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Start date</TableCell>
            <TableCell>End date</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {analyticsPeriod.sort(Sort.DESC).map(({ startDate, endDate, balance }) => {
            const id = `${startDate}#${endDate}`;
            return (
              <TableRow key={id}>
                <TableCell>{startDate}</TableCell>
                <TableCell>{endDate}</TableCell>
                <TableCell>{balance}</TableCell>
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
