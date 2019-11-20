import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import OtpStatus from './OtpStatus';

const useStyles = makeStyles(theme => ({
  root: {
    'text-align': 'center',
  },
  fab: {
    'background-color': 'white',
  },
  openBankAppBtn: {
    margin: theme.spacing(2),
  }
}));

function renderStatus(otpState, onRetryClick) {

  const classes = useStyles();

  if (otpState.status === OtpStatus.PENDING) {
    return (
      <Fab className={classes.fab}>
        <CircularProgress
          size="30px"
          variant="indeterminate"
          />
      </Fab>
    );
  } else {
    return <CheckCircleIcon />
  }
}

export default function OtpPending({ otpState, onRetryClick }) {

  const classes = useStyles();

  const onOpenBankAppClick = useCallback(() => {
    startApp.set({
      "application": otpState.apkId,
    }).start();
  });

  if (otpState.status === OtpStatus.PENDING || otpState.status === OtpStatus.VALIDATED) {
    return (
      <div className={classes.root}>
        <Typography variant="h6">Autentification forte</Typography>
        <div>
          <Button
            className={classes.openBankAppBtn}
            onClick={onOpenBankAppClick}
            variant="outlined"
            color="primary">Confirmation mobile requise</Button>
        </div>
        { renderStatus(otpState) }
      </div>
    );

  } else {
    return (
      <div className={classes.root}>
        <Typography paragraph>Une erreur est survenue pendant le processus d'authentification</Typography>
        <Button onClick={onRetryClick} variant="outlined" color="secondary">REESSAYER</Button>
      </div>
    );
  }
}

OtpPending.propTypes = {
};

OtpPending.defaultProps = {
  classes: {},
};
