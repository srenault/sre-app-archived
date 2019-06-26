import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import withAsyncComponent from '../../components/AsyncComponent';
import { withRefreshSubject } from '../Header';
import { ReleasePropTypes } from '../../propTypes/models/Release';
import { AsyncStatePropTypes } from '../../propTypes/react-async';
import { SubjectPropTypes } from '../../propTypes/rxjs';

const asyncFetch = ({ apiClient }) => apiClient.releases.list();

const ReleaseItem = ({
  release, isSelected, onSelected,
}) => {
  const { name, versions } = release;

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    if (onSelected) onSelected();
    setOpen(!open);
  });

  return (
    <>
      <ListItem
        button
        selected={isSelected}
        onClick={onClick}
      >
        <ListItemText primary={name} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open && isSelected} timeout="auto" unmountOnExit>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>sha1</TableCell>
              <TableCell>date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map(({ sha1, date, url }) => (
              <TableRow key={sha1}>
                <TableCell><a href={url}>{sha1}</a></TableCell>
                <TableCell>{date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </>
  );
};

ReleaseItem.propTypes = {
  release: ReleasePropTypes.isRequired,
  isSelected: PropTypes.bool,
  onSelected: PropTypes.func,
};

ReleaseItem.defaultProps = {
  isSelected: false,
  onSelected: () => {},
};

function ReleasesOverview({ asyncState, refreshSubject }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onSelected = useCallback((index) => {
    setSelectedIndex(index);
  });

  useEffect(() => {
    const subscription = refreshSubject.subscribe({
      next: () => asyncState.reload(),
    });

    return () => subscription.unsubscribe();
  });

  const releases = asyncState.data;

  return (
    <List>
      {releases.map((release, index) => (
        <ReleaseItem
          key={release.name}
          onSelected={() => onSelected(index)}
          release={release}
          isSelected={selectedIndex === index}
        />
      ))}
    </List>
  );
}

ReleasesOverview.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
  refreshSubject: SubjectPropTypes.isRequired,
};

export default withAsyncComponent(asyncFetch)(withRefreshSubject(ReleasesOverview));
