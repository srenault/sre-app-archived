import React, { useState, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import { LocalizationProvider, DateRangePicker, DateRangeDelimiter } from '@material-ui/pickers';
import Body from './Body';
import withAsyncComponent from 'components/AsyncComponent';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  datePicker: {
    justifyContent: 'center',
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

function Consumption({ apiClient, routePaths, location, history }) {
  const classes = useStyles();

  const qs = new URLSearchParams(location.search);

  const [dateRange, setDateRange] = useState([
    qs.get('startDate'),
    qs.get('endDate')
  ]);

  const [startDateS, endDateS] = dateRange;

  const startDate = startDateS && new Date(startDateS)

  const endDate = endDateS && new Date(endDateS)
console.log(startDateS, startDate);
  const onDateRangeChange = useCallback((range) => {
    const [dateA, dateB] = range;
    if (dateA && dateB) {
      history.push({
        search: `?startDate=${formatDate(dateA)}&endDate=${formatDate(dateB)}`,
      });
    } else if (dateA) {
      history.push({
        search: `?startDate=${formatDate(dateA)}`,
      });
    } else if (dateB) {
      history.push({
        search: `?endDate=${formatDate(dateB)}`,
      });
    }
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

      <Body
        startDate={startDate}
        endDate={endDate}
        apiClient={apiClient} />
    </Container>
  );
}

export default withRouter(Consumption);
