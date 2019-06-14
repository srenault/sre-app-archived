import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';

function Main({ children, classes }) {
  return (
    <Paper component="main" className={classes.root}>
      {children}
    </Paper>
  );
}

Main.propTypes = {
  children: PropTypes.any,
  classes: PropTypes.object,
};

Main.defaultProps = {
  children: [],
};

const styles = {
  root: {
    paddingTop: '90px',
    minHeight: 'calc(100vh - 90px)',
  }
};

export default withStyles(styles)(Main);
