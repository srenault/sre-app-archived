import React, { useCallback, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import PropTypes from 'prop-types';
import { StatementPropTypes } from '../../../../propTypes/models/Statement';

const Order = {
  ASC: 'asc',
  DESC: 'desc',
};

const OrderBy = {
  date: {
    id: 'date',
    func: (order) => (s1, s2) => {
      const d1 = new Date(s1.date).getTime();
      const d2 = new Date(s2.date).getTime();
      if (order.direction === Order.ASC) {
        return d1 - d2;
      }
      return d2 - d1;
    },
  },
  amount: {
    id: 'amount',
    func: (order) => (s1, s2) => {
      if (order.direction === Order.ASC) {
        return s1.amount - s2.amount;
      }
      return s2.amount - s1.amount;
    },
  },
};

const styles = () => ({
  table: {
    minWidth: 300,
  },
  tableCell: {
    paddingRight: 4,
    paddingLeft: 5,
  },
});

function Statements({ classes, data: statements }) {
  const [filter, setFilter] = useState({ credit: true, debit: true });

  const [order, setOrder] = useState({
    by: OrderBy.date,
    direction: Order.DESC,
  });

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

  const onSelectSort = useCallback((orderById) => () => {
    setOrder({
      by: OrderBy[orderById],
      direction: order.direction === Order.ASC ? Order.DESC : Order.ASC,
    });
  });

  const rows = statements.sort(order.by.func(order)).filter((statement) => {
    if (!filter.credit && !filter.debit) {
      return statement;
    } else {
      const c = filter.credit && statement.amount > 0;
      const d = filter.debit && statement.amount < 0;
      return c || d;
    }
  });

  const creditButtonStyles = filter.credit ? 'contained' : 'outlined';
  const debitButtonStyles = filter.debit ? 'contained' : 'outlined';

  return (
    <div className={classes.root}>
      <Typography variant="h4" align="center" gutterBottom>Relevé de compte</Typography>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <Button color="primary" variant={creditButtonStyles} onClick={onToggleCredit}>Credit</Button>
        </Grid>
        <Grid item>
          <Button color="primary" variant={debitButtonStyles} onClick={onToggleDebit}>Debit</Button>
        </Grid>
      </Grid>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>
              <TableSortLabel
                active={order.by.id === OrderBy.date.id}
                onClick={onSelectSort(OrderBy.date.id)}
                direction={order.direction}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell className={classes.tableCell}>Libellé</TableCell>
            <TableCell className={classes.tableCell}>
              <TableSortLabel
                active={order.by.id === OrderBy.amount.id}
                onClick={onSelectSort(OrderBy.amount.id)}
                direction={order.direction}
              >
                Montant
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({
            id, date, label, amount, balance,
          }) => {
            return (
              <TableRow key={id}>
                <TableCell className={classes.tableCell}>{date}</TableCell>
                <TableCell className={classes.tableCell}>{label}</TableCell>
                <TableCell className={classes.tableCell}>{amount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

Statements.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.arrayOf(StatementPropTypes),
};

Statements.defaultProps = {
  classes: {},
  data: [],
};

export default withStyles(styles)(Statements);
