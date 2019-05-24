import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withMenuSubject } from '../Header';
import { SubjectPropTypes } from '../../propTypes/rxjs';

function Nav({
  classes, history, routePaths, routeNavItems, menuSubject,
}) {
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  const openMenu = useCallback(() => setOpen(true), []);

  const toggleMenu = useCallback(() => setOpen(!open), []);

  const onClickItem = useCallback(item => (
    () => {
      setOpen(false);
      const { path } = routePaths[item];
      history.push(path);
    }
  ), []);

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
          {routeNavItems.map(({ label, key, Icon }) => (
            <ListItem onClick={onClickItem(key)} button key={key}>
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </div>
    </SwipeableDrawer>
  );
}

Nav.propTypes = {
  classes: PropTypes.object,
  menuSubject: SubjectPropTypes.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

Nav.defaultProps = {
  classes: {},
};

const styles = {
  list: {
    width: 250,
  },
};

export default withMenuSubject(withRouter(withStyles(styles)(Nav)));
