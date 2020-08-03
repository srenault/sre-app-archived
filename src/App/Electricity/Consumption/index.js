import React, { useEffect, useState, useCallback } from 'react';
import c3 from 'c3';
import { format } from 'date-fns';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { isAfter, isBefore } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Graphs from './Graphs';
import { makeStyles } from '@material-ui/core/styles';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

function DateTimePicker({ id, label, value, onChange }) {
  return (
    <KeyboardDatePicker
      margin="normal"
      id={id}
      label={label}
      format="MM/dd/yyyy"
      value={value}
      onChange={onChange}
      KeyboardButtonProps={{
        'aria-label': label,
      }}
      />
  );
}

export default function Consumption({ apiClient }) {

  const classes = useStyles();

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const onStartDateChange = useCallback(date => {
    if (!endDate || isBefore(date, endDate)) {
      setStartDate(date);
    }
  }, []);

  const onEndDateChange = useCallback(date => {
    if (!startDate || isAfter(date, startDate)) {
      setEndDate(date);
    }
  });

  return (
    <Container>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <DateTimePicker
            id={"consumption_date-from"}
            label="Début"
            value={startDate}
            onChange={onStartDateChange} />

          <DateTimePicker
            id={"consumption_date-to"}
            label="Fin"
            value={endDate}
            onChange={onEndDateChange} />
        </Grid>
      </MuiPickersUtilsProvider>

      <Divider className={classes.divider} />

      <Graphs apiClient={apiClient}
        startDate={startDate}
        endDate={endDate} />
    </Container>
  );
}
