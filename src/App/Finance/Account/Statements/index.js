import React, { useCallback, useEffect, useState } from 'react';
import { useAsync } from "react-async";
import ReactTable from "react-table";

import 'react-table/react-table.css';

export default function Statements({ apiClient, accountId, refreshSubscription }) {

  const promiseFn = useCallback(() => apiClient.finance.fetchStatements(accountId), []);

  const { data: statements, error, isLoading, reload } = useAsync({ promiseFn });


  const [filter, setFilter] = useState({ credit: false, debit: false });

  const onCreditButtonClick = useCallback(() => {
    setFilter({ credit: true, debit: false });
  });

  const onDebitButtonClick = useCallback(() => {
    setFilter({ credit: false, debit: true });
  });

  useEffect(() => {
    const subscription = refreshSubscription.subscribe({
      next: () => reload(),
    });

    return () => subscription.unsubscribe();
  });

  if (isLoading) {

    return (<div>Loading...</div>);

  } else {

    const data = statements.filter((statement) => {
      if (!filter.credit && !filter.debit) {
        return statement;
      } else {
        const c = filter.credit && statement.amount > 0;
        const d = filter.debit && statement.amount < 0;
        return c || d;
      }
    });

    const columns = [{
      Header: 'Date',
      accessor: 'date',
    }, {
      Header: 'Label',
      accessor: 'label',
      sortable: false,
    }, {
      Header: 'Amount',
      accessor: 'amount',
    }];

    const defaultSorted = [{
      id: 'date',
      desc: true
    }];

    return (
      <div className="statements">
        <button disabled={filter.credit} onClick={onCreditButtonClick}>Credit</button>
        <button disabled={filter.debit} onClick={onDebitButtonClick}>Debit</button>

        <ReactTable
          data={data}
          columns={columns}
          showPageSizeOptions={false}
          showPageJump={false}
          defaultSorted={defaultSorted}
          />
      </div>
    );
  }
}
