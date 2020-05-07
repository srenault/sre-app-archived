import React from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Period from './Period';
import Cost from './Cost';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

function Graphs({ asyncState }) {

  const classes = useStyles();

  return (
    <>
      <Cost data={asyncState.data} />
      <Divider className={classes.divider} />
      <Period data={asyncState.data} />
    </>
  );
}

const asyncFetch = ({ apiClient, startDate, endDate }) => {
  return apiClient.energy.electricity.fetchConsumption(startDate, endDate);
};

export default withAsyncComponent(asyncFetch)(Graphs);


Graphs.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};