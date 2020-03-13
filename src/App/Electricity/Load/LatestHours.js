import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import Container from '@material-ui/core/Container';
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
    <Container>
      <div>Lastest {hours} Hours</div>
      <div ref={chartEl} />
    </Container>
  );
}
