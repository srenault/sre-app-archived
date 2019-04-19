import React from 'react';
import Gauge from '../../../../components/Gauge';

import './expenses.css';

export default function Expenses({ data: expenses }) {
  return (
    <div className="expenses">
      {expenses.map(({ id, label, amount, threshold }) => (
        <Gauge key={id} label={label} amount={amount} threshold={threshold} />)
      )}
    </div>
  );
}
