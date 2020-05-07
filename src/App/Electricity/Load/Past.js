import React, { useRef, useEffect, useState } from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import LastHour from './LastHour';
import LatestHours from './LatestHours';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

function Past({ asyncState, apiClient }) {

  const classes = useStyles();

  return (
    <Container>
      <Typography
        gutterBottom="true"
        align="center"
        variant="h3">Charge</Typography>

      <LastHour data={asyncState.data} />

      <Divider className={classes.divider} />

      <LatestHours data={asyncState.data} />
    </Container>
  );
}

Past.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};

const asyncFetch = ({ apiClient }) => {
  return apiClient.energy.electricity.fetchLatestLoad();
};

export default withAsyncComponent(asyncFetch)(Past);
