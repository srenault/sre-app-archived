import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Statements from './Statements';
import Expenses from './Expenses';
import { withRefreshSubject } from 'App/Header';
import withOtpValidation from 'App/Finance/Otp';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import { SubjectPropTypes } from 'propTypes/rxjs';

const styles = (theme) => ({
  divider: {
    margin: `${theme.spacing(2)}px 0 ${theme.spacing(4)}px 0`,
  },
});

function Account({ classes, asyncState, refreshSubject }) {
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
      <Container>
        <Statements data={statements} />
      </Container>
    </div>
  );
}

const asyncFetch = ({ apiClient, accountId, startDate }) => apiClient.finance.fetchAccount(accountId, startDate);

export default withStyles(styles)(withOtpValidation(asyncFetch)(withRefreshSubject(Account)));

Account.propTypes = {
  classes: PropTypes.object.isRequired,
  asyncState: AsyncStatePropTypes.isRequired,
  refreshSubject: SubjectPropTypes.isRequired,
};
