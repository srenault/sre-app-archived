import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import withAsyncComponent from 'components/AsyncComponent';
import { withRefreshSubject } from 'App/Header';
import { makeStyles } from '@material-ui/core/styles';

function SelectMode({ selected, modes, onChange }) {
  return (
    <Select value={selected} onChange={onChange}>
      {
        modes.map(({ id, name }) => (
          <MenuItem value={id}>{name}</MenuItem>
        ))
      }
    </Select>
  );
}

const useStyles = makeStyles(() => ({
  table: {
    width: '80%',
    margin: 'auto',
  },
}));

function ManageHeaters({ apiClient, asyncState }) {
  const { channels, modes } = asyncState.data;

  const classes = useStyles();

  const [channelsStatus, setChannelsStatus] = useState(channels);

  const onChange = async (channel, mode) => {
    const { channels: updatedStatus } = await apiClient.heaters.update(channel, mode);
    setChannelsStatus(updatedStatus);
  };

  return (
    <Container>
      <Table className={classes.table}>
        {
          channelsStatus.map(({ id, name, mode }) => (
            <TableRow>
              <TableCell>
                <Typography>{name}</Typography>
              </TableCell>
              <TableCell>
                <SelectMode
                  selected={mode}
                  modes={modes}
                  onChange={(event) => onChange(id, event.target.value)}
                />
              </TableCell>
            </TableRow>
          ))
        }
      </Table>
    </Container>
  );
}

const asyncFetch = ({ apiClient }) => apiClient.heaters.status();

export default withAsyncComponent(asyncFetch)(withRefreshSubject(ManageHeaters));
