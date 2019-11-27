import React, { useCallback } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import OtpStatus from './OtpStatus';
import { OtpStatePropTypes } from '../../../propTypes/models/Otp';

const styles = (theme) => ({
  root: {
    'text-align': 'center',
  },
  fab: {
    'background-color': 'white',
  },
  openBankAppBtn: {
    margin: theme.spacing(2),
  },
});

function renderStatus({ classes, otpState }) {
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
    return <CheckCircleIcon />;
  }
}

function OtpPending({ otpState, onRetryClick, classes }) {
  const onOpenBankAppClick = useCallback(() => {
    window.startApp.set({
      application: otpState.apkId,
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
            color="primary"
          >Confirmation mobile requise
          </Button>
        </div>
        { renderStatus({ otpState, classes }) }
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        <Typography paragraph>Une erreur est survenue pendant le processus d&apos;authentification</Typography>
        <Button onClick={onRetryClick} variant="outlined" color="secondary">REESSAYER</Button>
      </div>
    );
  }
}

OtpPending.propTypes = {
  otpState: OtpStatePropTypes.isRequired,
};

export default withStyles(styles)(OtpPending);
