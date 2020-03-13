import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import Container from '@material-ui/core/Container';

function formatTime(date) {
  return format(date, 'd MMMM', { locale: frLocale });
}

export default function Cost({ data }) {

  const chartEl = useRef(null);

  const dates = data.consumption.map(({ date }) => new Date(date));

  const costValues = data.consumption.map(({ cost }) => cost);

  useEffect(() => {
    const chart = c3.generate({
      bindto: chartEl.current,
      data: {
        type: 'bar',
        x: 'x',
        columns: [
          ['x'].concat(dates),
          ['cost'].concat(costValues),
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
            format: (n) => `${n}€`,
          },
        }
      },
      legend: {
        show: false,
      },
    });

    return () => chart.destroy();
  });

  return (
    <Container>
      <div>Cost</div>
      <div ref={chartEl}></div>
    </Container>
  );
}

Cost.propTypes = {
};

Cost.defaultProps = {
};
