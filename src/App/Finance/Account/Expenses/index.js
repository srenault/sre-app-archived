import React from 'react';
import Grid from '@material-ui/core/Grid';
import Gauge from '../../../../components/Gauge';

import './expenses.css';

export default function Expenses({ data: expenses }) {
  return (
    <div className="expenses">
      <Grid container spacing={24} justify="center">
      {expenses.map(({ id, label, amount, threshold }) => (
        <Grid key={id} item xs={12} sm={6} md={3} lg={2} xl={1}>
          <Gauge label={label} amount={amount} threshold={threshold} />
        </Grid>
      ))}
      </Grid>
    </div>
  );
}
