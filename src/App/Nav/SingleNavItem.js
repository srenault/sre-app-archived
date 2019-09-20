import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export default function SingleNavItem({
  label, Icon, path, onClick,
}) {
  return (
    <ListItem onClick={onClick(path)} button>
      <ListItemIcon><Icon /></ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
}

SingleNavItem.propTypes = {
  label: PropTypes.string.isRequired,
  Icon: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
