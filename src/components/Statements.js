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
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import PropTypes from 'prop-types';
import { StatementPropTypes } from 'propTypes/models/Statement';
import { PeriodPropTypes } from 'propTypes/models/Period';

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
  accountId: {
    id: 'accountId',
    func: (order) => (s1, s2) => {
      return s1.accountId >= s2.accountId;
    },
  },
};

const styles = () => ({
  title: {
    '&::first-letter': {
      textTransform: 'capitalize',
    },
  },
  table: {
    tableLayout: 'fixed',
  },
  tableCell: {
    textAlign: 'center',
  },
  tableCellAccountId: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    }
  }
});

function Statements({ classes, period, statements, showAccountId }) {
  const [filter, setFilter] = useState({
    credit: true,
    debit: true,
    accountId: null,
  });

  const [order, setOrder] = useState({
    by: OrderBy.date,
    direction: Order.DESC,
    accountId: Order.ASC,
  });

  const onToggleCredit = useCallback(() => {
    if (filter.debit) {
      setFilter({ ...filter, credit: !filter.credit, debit: filter.debit });
    }
  });

  const onToggleDebit = useCallback(() => {
    if (filter.credit) {
      setFilter({ ...filter, credit: filter.credit, debit: !filter.debit });
    }
  });

  const onToggleAccountId = useCallback(() => {
    if (filter.accountId) {
      setFilter({ ...filter, accountId: null });
    }
  });

  const onSelectSort = useCallback((orderById) => () => {
    setOrder({
      by: OrderBy[orderById],
      direction: order.direction === Order.ASC ? Order.DESC : Order.ASC,
    });
  });

  const onClickAccountId = useCallback((accountId) => () => {
    setFilter({ ...filter, accountId });
    console.log(accountId);
  });

  const rows = statements.sort(order.by.func(order)).filter((statement) => {
    if (!filter.credit && !filter.debit && !filter.accountId) {
      return statement;
    } else {
      const isAccountId = filter.accountId ? filter.accountId === statement.accountId : true;
      const isCredit = filter.credit && statement.amount > 0 && isAccountId;
      const isDebit = filter.debit && statement.amount < 0 && isAccountId;
      return isCredit || isDebit;
    }
  });

  const creditButtonStyles = filter.credit ? 'contained' : 'outlined';
  const debitButtonStyles = filter.debit ? 'contained' : 'outlined';

  const title = period.yearMonth
    ? `Relevé de compte du mois de ${format(new Date(period.yearMonth), 'MMMM yyyy', { locale: frLocale })}`
    : `Relevé de compte depuis le ${format(new Date(period.startDate), 'dd MMMM yyyy')}`;

  return (
    <div className={classes.root}>
      <Typography variant="h4" align="center" gutterBottom className={classes.title}>{title}</Typography>
      <Grid container spacing={2} justify="center">
        <Grid item>
          <Button color="primary" variant={creditButtonStyles} onClick={onToggleCredit}>Credit</Button>
        </Grid>
        <Grid item>
          <Button color="primary" variant={debitButtonStyles} onClick={onToggleDebit}>Debit</Button>
        </Grid>
        {
          showAccountId && filter.accountId && (
            <Grid item>
              <Button color="primary" endIcon={<DeleteIcon/>} variant="outlined" onClick={onToggleAccountId}>
                {filter.accountId}
              </Button>
            </Grid>
          )
        }
      </Grid>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: showAccountId ? '15%' : '20%' }} className={classes.tableCell}>
              <TableSortLabel
                active={order.by.id === OrderBy.date.id}
                onClick={onSelectSort(OrderBy.date.id)}
                direction={order.direction}
              >
                Date
              </TableSortLabel>
            </TableCell>
            {
              showAccountId && (
                <TableCell style={{ width: '15%' }} className={classes.tableCell}>
                  <TableSortLabel
                    active={order.by.id === OrderBy.amount.id}
                    onClick={onSelectSort(OrderBy.accountId.id)}
                    direction={order.direction}
                  >
                    Account
                  </TableSortLabel>
                </TableCell>
              )
            }
            <TableCell style={{ width: showAccountId ? '55%' : '60%' }} className={classes.tableCell}>Libellé</TableCell>
            <TableCell style={{ width: showAccountId ? '15%' : '20%' }} className={classes.tableCell}>
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
            id, date, label, amount, accountId
          }) => (
            <TableRow key={id}>
              <TableCell className={classes.tableCell}>{date}</TableCell>
              <TableCell className={classes.tableCell}><a onClick={onClickAccountId(accountId)} className={classes.tableCellAccountId}>{accountId}</a></TableCell>
              <TableCell style={{ fontSize: '0.7rem' }} className={classes.tableCell}>{label}</TableCell>
              <TableCell className={classes.tableCell}>{amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
        }

Statements.propTypes = {
  classes: PropTypes.object,
  statements: PropTypes.arrayOf(StatementPropTypes),
  period: PeriodPropTypes.isRequired,
};

Statements.defaultProps = {
  classes: {},
  statements: [],
};

export default withStyles(styles)(Statements);
