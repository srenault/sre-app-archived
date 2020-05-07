import React, { useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import c3 from 'c3';
import { formatTime, buildGraph } from './data';

export default function LastHour({ data }) {

  const chartEl = useRef(null);

  const { dates, values } = buildGraph(data, { period: { hours: 1 } });

  useEffect(() => {
    const chart = c3.generate({
      padding: {
        right: 20,
      },
      bindto: chartEl.current,
      data: {
        type: 'step',
        x: 'x',
        columns: [
          ['x'].concat(dates),
          ['Values'].concat(values),
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
      legend: {
        show: false,
      },
    });

    return () => chart.destroy();
  });

  return (
    <>
      <Typography
        gutterBottom="true"
        variant="subtitle1">Dernière heure</Typography>

      <div ref={chartEl} />
    </>
  );
}
