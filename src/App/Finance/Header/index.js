import React, { useCallback } from 'react';

import Header from "../../Header";

export default function FinanceHeader({ refreshSubscription }) {

  const onRefresh = useCallback(() => refreshSubscription.next());

  return (
    <Header>Finance <button onClick={onRefresh}>Refresh</button></Header>
  );
}
