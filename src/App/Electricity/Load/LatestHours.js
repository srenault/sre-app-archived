import React, { useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import c3 from 'c3';
import { formatTime, buildGraph } from './data';

export default function LastestHours({ data }) {

  const chartEl = useRef(null);

  const hours = 24;

  const { dates, min, max, mean } = buildGraph(data, {
    period: { hours },
    groupBy: { minutes: 30 }
  });

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
          ['Min'].concat(min),
          ['Max'].concat(max),
          ['Mean'].concat(mean),
        ],
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            fit: true,
            culling: {
              max: 4,
            },
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

  return (
    <>
      <Typography
        gutterBottom="true"
        variant="subtitle1">Dernières {hours} heures</Typography>

      <div ref={chartEl} />
    </>
  );
}
