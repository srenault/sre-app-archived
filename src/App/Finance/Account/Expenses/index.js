import React, { useCallback } from 'react';
import { useAsync } from 'react-async';
import Gauge from '../../../../components/Gauge';

import './expenses.css';

export default function Expenses({ accountId, apiClient, refreshSubscription }) {

  const promiseFn = useCallback(() => apiClient.finance.fetchCategorizedExpenses(accountId), []);

  const { data: expenses, error, isLoading } = useAsync({ promiseFn });

  if (isLoading) {

    return (<div>Loading...</div>);

  } else {

    return (
      <div className="expenses">
        {expenses.map(({ id, label, amount, threshold }) => (
          <Gauge key={id} label={label} amount={amount} threshold={threshold} />)
        )}
      </div>
    );
  }
}
