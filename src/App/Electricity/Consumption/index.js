import React, { useEffect, useState, useCallback } from 'react';
import c3 from 'c3';
import { format } from 'date-fns';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Graphs from './Graphs';

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function DateTimePicker({ id, label, value, onChange }) {

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
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
      </Grid>
      </MuiPickersUtilsProvider>
  );
}

export default function Consumption({ apiClient }) {

  const [startDate, setStartDate] = useState(null);

  const [endDate, setEndDate] = useState(null);

  const onStartDateChange = useCallback((date) => setStartDate(date), []);

  const onEndDateChange = useCallback((date) => setEndDate(date), []);

  return (
    <Container>
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

      <Graphs apiClient={apiClient}
        startDate={startDate}
        endDate={endDate} />
    </Container>
  );
}
