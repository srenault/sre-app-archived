import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  root: {
    'text-align': 'center',
  },
  fab: {
    'background-color': 'white',
  },
};

function Loading({ classes }) {
  return (
    <div className={classes.root}>
      <Fab className={classes.fab}>
        <CircularProgress
          size="30px"
          variant="indeterminate"
        />
      </Fab>
    </div>
  );
}

Loading.propTypes = {
  classes: PropTypes.object,
};

Loading.defaultProps = {
  classes: {},
};

export default withStyles(styles)(Loading);
