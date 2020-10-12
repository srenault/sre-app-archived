import {
  format, isAfter, isBefore, add, sub,
} from 'date-fns';

export function formatTime(date) {
  return format(date, 'HH:mm');
}

export function buildGraph(data, { period, groupBy }) {
  const values = data.result.reduce((acc, p) => {
    const date = new Date(p.date);
    if (period ? isBefore(date, sub(new Date(), period)) : false) {
      return acc;
    } else {
      const [h, ...tail] = acc;
      if (h) {
        const inGroup = groupBy ? isAfter(date, h.date) && isBefore(date, add(h.date, groupBy)) : false;
        if (inGroup) {
          return [{ date: h.date, values: h.values.concat(p.value) }, ...tail];
        } else {
          return [{ date, values: [p.value] }].concat(acc);
        }
      } else {
        return [{ date, values: [p.value] }].concat(acc);
      }
    }
  }, []).reverse();

  if (groupBy) {
    const stats = values.map(({ date, values: v }) => {
      const mean = Math.round(v.reduce((a, b) => a + b) / v.length);

      const min = Math.round(v.reduce((a, b) => (a < b ? a : b)));

      const max = Math.round(v.reduce((a, b) => (a > b ? a : b)));

      return {
        date,
        value: {
          min,
          max,
          mean,
        },
      };
    });

    const dates = stats.map((p) => p.date);

    const min = stats.map((p) => p.value.min);

    const max = stats.map((p) => p.value.max);

    const mean = stats.map((p) => p.value.mean);

    return {
      dates,
      min,
      max,
      mean,
    };
  } else {
    return {
      dates: values.map(({ date }) => date),
      values: values.reduce((acc, { values: v }) => acc.concat(v), []),
    };
  }
}

export default {
  formatTime,
  buildGraph,
};
