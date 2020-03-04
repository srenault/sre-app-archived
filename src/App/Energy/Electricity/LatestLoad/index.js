import React, { useRef, useEffect } from 'react';
import c3 from 'c3';
import { format, isAfter, isBefore, add, sub, startOfDay } from 'date-fns';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

function formatTime(date) {
  return format(date, 'HH:mm');
}

function LatestLoad({ asyncState }) {

  const valuesByPeriods = asyncState.data.result.reduce((acc, p) => {
    const date = new Date(p.date);
    if (isBefore(date, sub(new Date(), { hours: 24 }))) {
      return acc;
    } else {
      const [h, ...tail] = acc;
      if (h) {
        const inPeriod = isAfter(date, h.date) && isBefore(date, add(h.date, { minutes: 30 }));
        if (inPeriod) {
          return [{ date: h.date, values: h.values.concat(p.value) }, ...tail];
        } else {
          return [{ date, values: [p.value] }].concat(acc);
        }
      } else {
        return [{ date, values: [p.value] }].concat(acc);
      }
    }
  }, []).reverse();

  const statsByPeriods = valuesByPeriods.map(({ date, values }) => {
    const mean = Math.round(values.reduce((a, b) => a + b) / values.length);

    const min = Math.round(values.reduce((a, b) => {
      return a < b ? a : b;
    }));

    const max = Math.round(values.reduce((a, b) => {
      return a > b ? a : b;
    }));

    return {
      date,
      value: {
        min,
        max,
        mean,
      },
    };
  });

  const minValues = statsByPeriods.map((p) => p.value.min);

  const maxValues = statsByPeriods.map((p) => p.value.max);

  const meanValues = statsByPeriods.map((p) => p.value.mean);

  const dates = statsByPeriods.map((p) => p.date);

  const chartEl = useRef(null);

  useEffect(() => {
    const chart = c3.generate({
      bindto: chartEl.current,
      data: {
        type: 'step',
        x: 'x',
        columns: [
          ['x'].concat(dates),
          ['Min'].concat(minValues),
          ['Max'].concat(maxValues),
          ['Mean'].concat(meanValues),
        ],
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
            format: (n) => `${n}%`,
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

  const lastMinValue = minValues[minValues.length - 1];
  const lastMeanValue = meanValues[meanValues.length - 1];
  const lastMaxValue = maxValues[maxValues.length - 1];

  return (
      <div className="electricity_load">
        <Grid container justify="center" spacing={2}>
          <Grid item key="load_min">
            <Card>
              <CardContent>
                <Typography variant="h6">Min</Typography>
                <Typography variant="h3">{lastMinValue}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item key="load_mean">
            <Card>
              <CardContent>
                <Typography variant="h6">Mean</Typography>
                <Typography variant="h3">{lastMeanValue}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item key="load_max">
            <Card>
              <CardContent>
                <Typography variant="h6">Max</Typography>
                <Typography variant="h3">{lastMaxValue}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Container>
          <div ref={chartEl} />
        </Container>
      </div>
  );
}

LatestLoad.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};

const asyncFetch = ({ apiClient }) => {
  return apiClient.energy.electricity.fetchLatestLoad();
};

export default withAsyncComponent(asyncFetch)(LatestLoad);
