import React, { useCallback, useEffect } from 'react';
import { useAsync } from 'react-async';
import Statements from './Statements';
import Expenses from './Expenses';

export default function Account({ accountId, startDate, apiClient, refreshSubscription }) {

  const promiseFn = useCallback(() => apiClient.finance.fetchAccount(accountId), []);

  const { data, error, isLoading, reload } = useAsync({ promiseFn });

  useEffect(() => {
    const subscription = refreshSubscription.subscribe({
      next: () => reload(),
    });
    return () => subscription.unsubscribe();
  });

  if (isLoading) {

    return (<div>Loading...</div>);

  } else {

    const { expenses, statements } = data;

    return (
        <div className="account">
          <Expenses data={expenses} />
          <Statements data={statements} />
        </div>
    );
  }
}
