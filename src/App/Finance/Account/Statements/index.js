import React, { useCallback, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import PropTypes from 'prop-types';
import { StatementPropTypes } from '../../../../propTypes/models/Statement';

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

  const creditButtonStyles = { variant: filter.credit ? 'contained' : 'outlined' };
  const debitButtonStyles = { variant: filter.debit ? 'contained' : 'outlined' };

  return (
    <div className={classes.root}>
      <Typography variant="h4" align="center" gutterBottom>Relevé de compte</Typography>
      <Grid container spacing={24} justify="center">
        <Grid item>
          <Button color="primary" {...creditButtonStyles} onClick={onToggleCredit}>Credit</Button>
        </Grid>
        <Grid item>
          <Button color="primary" {...debitButtonStyles} onClick={onToggleDebit}>Debit</Button>
        </Grid>
      </Grid>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>Date</TableCell>
            <TableCell className={classes.tableCell}>Libellé</TableCell>
            <TableCell className={classes.tableCell}>Montant</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({
            date, label, amount, balance,
          }) => {
            const id = [date, label, amount, balance].join('#');
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
