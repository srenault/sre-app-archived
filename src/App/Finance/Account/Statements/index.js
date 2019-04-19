import React, { useCallback, useState } from 'react';
import ReactTable from "react-table";

import 'react-table/react-table.css';

export default function Statements({ data: statements }) {

  const [filter, setFilter] = useState({ credit: false, debit: false });

  const onCreditButtonClick = useCallback(() => {
    setFilter({ credit: true, debit: false });
  });

  const onDebitButtonClick = useCallback(() => {
    setFilter({ credit: false, debit: true });
  });

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
    desc: true,
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
