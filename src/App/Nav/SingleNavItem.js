import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export default function SingleNavItem({ label, Icon, path, onClick }) {
  return (
    <ListItem onClick={onClick(path)} button>
      <ListItemIcon><Icon /></ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
}