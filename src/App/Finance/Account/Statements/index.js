import React, { useCallback, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

export default function Statements({ data: statements }) {

  const [filter, setFilter] = useState({ credit: true, debit: true });

  const onToggleCredit = useCallback(() => {
    if (filter.debit) {
      setFilter({ credit: !filter.credit, debit: filter.debit });
    }
  });

  const onToggleDebit = useCallback(() => {
    if (filter.credit) {
      setFilter({ credit: filter.credit, debit: !filter.debit });
    }
  });

  const rows = statements.filter((statement) => {
    if (!filter.credit && !filter.debit) {
      return statement;
    } else {
      const c = filter.credit && statement.amount > 0;
      const d = filter.debit && statement.amount < 0;
      return c || d;
    }
  });

  const creditButtonStyles = { variant: filter.credit ? 'contained' :  'outlined' };
  const debitButtonStyles = { variant: filter.debit ? 'contained' :  'outlined' };

  return (
    <div className="statements">
      <Button color="primary" {...creditButtonStyles} onClick={onToggleCredit}>Credit</Button>
      <Button color="primary" {...debitButtonStyles} onClick={onToggleDebit}>Debit</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({date, label, amount}, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{date}</TableCell>
                <TableCell>{label}</TableCell>
                <TableCell>{amount}</TableCell>
              </TableRow>
            );
           })}
         </TableBody>
      </Table>
    </div>
  );
}
