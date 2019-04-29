import React, { useCallback, useEffect } from 'react';
import { useAsync } from 'react-async';
import Statements from './Statements';
import Expenses from './Expenses';
import { withRefreshSubject } from '../../Header';

function Account({ accountId, startDate, apiClient, refreshSubject }) {

  const promiseFn = useCallback(() => apiClient.finance.fetchAccount(accountId), []);

  const { data, error, isLoading, reload } = useAsync({ promiseFn });

  useEffect(() => {
    const subscription = refreshSubject.subscribe({
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

export default withRefreshSubject(Account);
