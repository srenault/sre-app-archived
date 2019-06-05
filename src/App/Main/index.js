import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import './Main.css';

export default function Main({ children }) {
  return (
    <Paper component="main" className="dashboard-main">
      {children}
    </Paper>
  );
}

Main.propTypes = {
  children: PropTypes.any,
};

Main.defaultProps = {
  children: [],
};
