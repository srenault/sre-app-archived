import React, { useCallback, useEffect } from 'react';
import { useAsync } from 'react-async';
import Statements from './Statements';
import Expenses from './Expenses';
import { withRefreshSubject } from '../../Header';
import withAsyncComponent from '../../../components/AsyncComponent';

function Account({ accountId, startDate, asyncState, refreshSubject }) {

  useEffect(() => {
    const subscription = refreshSubject.subscribe({
      next: () => asyncState.reload(),
    });
    return () => subscription.unsubscribe();
  });

  const { expenses, statements } = asyncState.data;

  return (
    <div className="account">
      <Expenses data={expenses} />
      <Statements data={statements} />
    </div>
  );
}

const asyncFetch = ({ apiClient, accountId }) => apiClient.finance.fetchAccount(accountId);

export default withAsyncComponent(asyncFetch)(withRefreshSubject(Account));
