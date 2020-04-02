import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';

function formatTime(date) {
  return format(date, 'd MMMM', { locale: frLocale });
}

export default function Period({ data }) {

  const chartEl = useRef(null);

  const dates = data.consumption.map(({ date }) => new Date(date));

  const hcValues = data.consumption.map(({ hc }) => hc);

  const hpValues = data.consumption.map(({ hp }) => hp);

  useEffect(() => {
    const chart = c3.generate({
      bindto: chartEl.current,
      data: {
        type: 'step',
        x: 'x',
        columns: [
          ['x'].concat(dates),
          ['hc'].concat(hcValues),
          ['hp'].concat(hpValues),
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
            format: (n) => `${n}kWh`,
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
      <div>Consommation</div>
      <div ref={chartEl}></div>
    </>
  );
}

Period.propTypes = {
};

Period.defaultProps = {
};
