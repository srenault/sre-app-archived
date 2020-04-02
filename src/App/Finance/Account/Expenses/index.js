import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Gauge from 'components/Gauge';

export default function Expenses({ data: expenses }) {
  return (
    <div className="expenses">
      <Grid container spacing={2} justify="center">
        {expenses.map(({
          id, label, amount, threshold,
        }) => (
          <Grid item key={id} xs={12} sm={6} md={3} lg={2} xl={1}>
            <Gauge
              label={label}
              value={amount}
              threshold={threshold}
              format={(value) => `${value}€`} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

Expenses.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    amount: PropTypes.number,
    threshold: PropTypes.number,
  })).isRequired,
};
