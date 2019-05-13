import React, { useCallback, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import { useAsync } from 'react-async';
import Statements from './Statements';
import Expenses from './Expenses';
import { withRefreshSubject } from '../../Header';
import withAsyncComponent from '../../../components/AsyncComponent';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  divider: {
    margin: `${theme.spacing.unit * 2}px 0 ${theme.spacing.unit * 4}px 0`,
  },
});

function Account({ classes, accountId, startDate, asyncState, refreshSubject }) {

  useEffect(() => {
    const subscription = refreshSubject.subscribe({
      next: () => asyncState.reload(),
    });
    return () => subscription.unsubscribe();
  });

  const { expenses, statements, displayName } = asyncState.data;

  return (
    <div className="account">
      <Typography variant="h3" align="center" gutterBottom>{displayName}</Typography>
      <Expenses data={expenses} />
      <Divider className={classes.divider} />
      <Statements data={statements} />
    </div>
  );
}

const asyncFetch = ({ apiClient, accountId }) => apiClient.finance.fetchAccount(accountId);

export default withStyles(styles)(withAsyncComponent(asyncFetch)(withRefreshSubject(Account)));
