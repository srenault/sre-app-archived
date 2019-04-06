import React, { useEffect, useRef } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const COLORS = {
  red: '#FF0000',
  orange: '#F97600',
  yellow: '#F6C600',
  green: '#60B044'
};

const THRESHOLD_STEP_COLORS = [COLORS.green, COLORS.yellow, COLORS.orange];

const THRESHOLD_COLORS = THRESHOLD_STEP_COLORS.concat(COLORS.red);

export default function Gauge({ label, amount, threshold }) {

  const chartEl = useRef(null);

  useEffect(() => {

    const thresholdColors = [];
    const thresholdStep = threshold / (THRESHOLD_STEP_COLORS.length);
    const thresholdValues = THRESHOLD_STEP_COLORS.map((_, i) => (i + 1) * thresholdStep);

    const chart = c3.generate({
      bindto: chartEl.current,
      gauge: {
        min: 0,
        max: thresholdValues[thresholdValues.length - 1],
        label: {
          format(value) {
            return `${value}€`;
          },
        },
      },
      data: {
        type: 'gauge',
        columns: [[label, amount]],
      },
      color: {
        pattern: THRESHOLD_COLORS,
        threshold: {
          values: thresholdValues,
        }
      },
      size: {
        width: 400,
      }
    });

    return () => chart.destroy();
  });

  return (
    <div ref={chartEl}></div>
  );
}
