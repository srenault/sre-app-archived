import React, { useRef, useState, useEffect } from 'react';
import { parseISO, format, differenceInMilliseconds } from 'date-fns';
import c3 from 'c3';

function formatTime(date) {
  return format(date, 'HH:mm:ss');
}

export default function CurrentGraph({ asyncState, apiClient }) {

  const chartEl = useRef(null);

  let chart = null;

  let data = [];

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {
        if (event.type === 'teleinfo_current') {
          const lastUpdate = parseISO(event.lastUpdate);

          data = data.concat({ value: event.value, lastUpdate });

          if (chart) {
            const values = data.map(d => d.value);
            const dates = data.map(d => d.lastUpdate);

            chart.load({
              columns: [
                ['x'].concat(dates),
                ['current'].concat(values),
              ]
            });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    chart = c3.generate({
      padding: {
        right: 20,
      },
      bindto: chartEl.current,
      data: {
        type: 'line',
        x: 'x',
        columns: [
          ['x'],
          ['current'],
        ],
        names: {
          current: 'Courant',
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
            format: (n) => `${n}A`,
          },
        },
      },
    });

    return () => chart.destroy();
  });

  return (
    <div ref={chartEl}></div>
  );
}
