import React, { useRef, useState, useEffect } from 'react';
import { parseISO, format, differenceInMilliseconds } from 'date-fns';
import c3 from 'c3';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

function formatTime(date) {
  return format(date, 'HH:mm:ss');
}

function limitArray(arr, limit) {
  const oversize = arr.length - limit;
  if (oversize > 0) {
    return arr.splice(oversize);
  } else {
    return arr;
  }
}

export default function CurrentGraph({ asyncState, apiClient, pause }) {

  const chartEl = useRef();

  const chartRef = useRef();

  const dataRef = useRef([]);

  useEffect(() => {
    const subscription = apiClient.energy.electricity.stream.subscribe({
      next: (event) => {
        if (event.type === 'teleinfo_current' && !pause) {
          const lastUpdate = parseISO(event.lastUpdate);

          dataRef.current = limitArray(dataRef.current.concat({ value: event.value, lastUpdate }), 20);

          if (chartRef.current) {
            const values = dataRef.current.map(d => d.value);
            const dates = dataRef.current.map(d => d.lastUpdate);

            chartRef.current.load({
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
  }, [pause]);

  useEffect(() => {
    chartRef.current = c3.generate({
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
      legend: {
        show: false,
      },
    });

    return () => chartRef.current.destroy();
  }, []);

  return (
    <div ref={chartEl}></div>
  );
}
