import React from 'react';
import { useAsyncPolling } from "../../../../hooks";

export default function Balances({ apiClient }) {

  const {
    data: balances,
    error, isLoading,
    setData: setBalances,
    reload: refreshBalances
  } = useAsyncPolling(apiClient.finance.fetchBalances, 5000);

  if (isLoading) {

    return (<div>Loading...</div>);

  } else {

    return (
      <div className="balances">
        {balances.map(({ label }, i) => (
          <p key={i}>{label}</p>
        ))}
      </div>
    );
  }
}
