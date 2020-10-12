import React, { useState, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import { LocalizationProvider, DateRangePicker, DateRangeDelimiter } from '@material-ui/pickers';
import Graphs from './Graphs';

const useStyles = makeStyles((theme) => ({
  datePicker: {
    justifyContent: 'center',
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export default function Consumption({ apiClient }) {
  const classes = useStyles();

  const [dateRange, setDateRange] = useState([null, null]);

  const [startDate, endDate] = dateRange;

  const onDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  return (
    <Container>
      <LocalizationProvider dateAdapter={DateFnsAdapter}>
        <DateRangePicker
          startText="Début"
          endText="Fin"
          value={dateRange}
          onChange={onDateRangeChange}
          maxDate={new Date()}
          className={classes.datePicker}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <DateRangeDelimiter> to </DateRangeDelimiter>
              <TextField {...endProps} />
            </>
          )}
        />
      </LocalizationProvider>

      <Divider className={classes.divider} />

      <Graphs
        apiClient={apiClient}
        startDate={startDate}
        endDate={endDate}
      />
    </Container>
  );
}
