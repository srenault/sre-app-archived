import React, { useEffect, useRef } from 'react';
import withAsyncComponent from 'components/AsyncComponent';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import c3 from 'c3';
import { format } from 'date-fns';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Period from './Period';
import Cost from './Cost';

function Consumption({ asyncState }) {

  const handleChange = () => {};

  return (
    <Container>
      <FormControl>
        <InputLabel htmlFor="age-native-helper">Age</InputLabel>
        <NativeSelect
          value={18}
          onChange={handleChange('age')}
          inputProps={{
            name: 'age',
            id: 'age-native-helper',
          }}
          >
          <option value="" />
          <option value={10}>Ten</option>
          <option value={20}>Twenty</option>
          <option value={30}>Thirty</option>
        </NativeSelect>
      </FormControl>
      <Period data={asyncState.data} />
      <Cost data={asyncState.data} />
    </Container>
  );
}

Consumption.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
};

Consumption.defaultProps = {
};

const asyncFetch = ({ apiClient }) => {
  return apiClient.energy.electricity.fetchConsumption();
};

export default withAsyncComponent(asyncFetch)(Consumption);
