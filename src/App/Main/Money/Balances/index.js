import React, { useEffect } from 'react';
import { useAsync } from "react-async";

async function fetchBalances() {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve([{ label: Date.now() }]), 1000);
  });
}

export default function Balances() {

  const {
    data: balances,
    error, isLoading,
    setData: setBalances,
    reload: refreshBalances
  } = useAsync({ promiseFn: fetchBalances });

  useEffect(() => {
    const i = setInterval(() => refreshBalances(), 5000)
    return () => clearInterval(i);
  })

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
