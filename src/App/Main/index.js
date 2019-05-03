import React from 'react';

import Paper from '@material-ui/core/Paper';
import "./Main.css";

export default function Main(props) {

  return (
    <Paper component="main" className="dashboard-main">
      {props.children}
    </Paper>
  );
}
