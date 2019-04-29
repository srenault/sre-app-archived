import React, { useEffect } from 'react';
import { useAsync } from 'react-async';
import { Link } from 'react-router-dom';
import { withRefreshSubject } from '../../Header';

function renderAccount(startPeriod, { id, displayName, balance }) {
  return (
    <p key={id}><Link to={`/finance/accounts/${id}/${startPeriod}`}>{displayName} ~ {balance} €</Link></p>
  );
}

function AccountsOverview({ apiClient, refreshSubject }) {

  const promiseFn = apiClient.finance.fetchAccountsOverview;

  const { data: overview, error, isLoading, reload } = useAsync({ promiseFn });

  useEffect(() => {
    const subscription = refreshSubject.subscribe({
      next: () => reload(),
    });

    return () => subscription.unsubscribe();
  });

  if (isLoading) {

    return (<div>Loading...</div>);

  } else {
    const jointAccounts = overview.accounts.filter((account) => account.type === 'joint_account');
    const currentAccounts = overview.accounts.filter((account) => account.type === 'current_account');
    const savingAccounts = overview.accounts.filter((account) => account.type === 'saving_account');
    const balance = Math.round(overview.credit + overview.debit);
    const renderLink = renderAccount.bind(null, overview.startPeriod);

    return (
      <div className="accounts">
        <div>{ overview.startPeriod } - { balance } €</div>
        {jointAccounts.map(renderLink)}
        {currentAccounts.map(renderLink)}
        {savingAccounts.map(renderLink)}
      </div>
    );
  }
}

export default withRefreshSubject(AccountsOverview);
