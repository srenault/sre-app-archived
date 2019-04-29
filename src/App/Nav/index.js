import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { withMenuSubject } from '../Header';

import './Nav.css';

function Nav({ classes, history, routePaths, routeNavItems, menuSubject }) {
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  const openMenu = useCallback(() => setOpen(true), []);

  const toggleMenu = useCallback(() => setOpen(!open), []);

  const onClickItem = useCallback((item) => {
    setOpen(false);
    const path = routePaths[item].path;
    history.push(path);
  });

  useEffect(() => {
    const subscription = menuSubject.subscribe({
      next: () => toggleMenu(),
    });
    return () => subscription.unsubscribe();
  });

  return (
    <SwipeableDrawer open={open} onClose={closeMenu} onOpen={openMenu}>
      <div className={classes.list}>
        <List>
          {routeNavItems.map(({ path, label, key, Icon }) => (
            <ListItem onClick={onClickItem.bind(null, key)} button key={key}>
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </div>
    </SwipeableDrawer>
  );
}

const styles = {
  list: {
    width: 250,
  },
};

export default withMenuSubject(withRouter(withStyles(styles)(Nav)));
