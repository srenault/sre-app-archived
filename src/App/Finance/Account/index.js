import React from 'react';
import Statements from './Statements';
import Expenses from './Expenses';

export default function Account({ accountId, apiClient, refreshSubscription }) {

  return (
    <div className="account">
      <Expenses accountId={accountId} apiClient={apiClient} />
      <Statements accountId={accountId} apiClient={apiClient} refreshSubscription={refreshSubscription} />
    </div>
  );
}
