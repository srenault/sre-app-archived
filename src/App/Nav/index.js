import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import { withMenuSubject } from '../Header';
import { SubjectPropTypes } from '../../propTypes/rxjs';
import { RouteNavItemsPropTypes } from '../../propTypes/models/Routes';
import SingleNavItem from './SingleNavItem';
import GroupNavItems from './GroupNavItems';

function Nav({
  classes, history, routeNavItems, menuSubject,
}) {
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  const openMenu = useCallback(() => setOpen(true), []);

  const toggleMenu = useCallback(() => setOpen(!open), []);

  const onClickItem = useCallback((path) => (
    () => {
      setOpen(false);
      history.push(path);
    }
  ), []);

  useEffect(() => {
    const subscription = menuSubject.subscribe({
      next: () => toggleMenu(),
    });
    return () => subscription.unsubscribe();
  });

  const NavItem = ({ item }) => {
    if (Array.isArray(item)) {
      return <GroupNavItems items={item} onClick={onClickItem} />;
    } else {
      const { label, Icon, path } = item;
      return <SingleNavItem label={label} Icon={Icon} path={path} onClick={onClickItem} />;
    }
  };

  return (
    <SwipeableDrawer open={open} onClose={closeMenu} onOpen={openMenu}>
      <div className={classes.list}>
        <List>
          {routeNavItems.map((navItem) => {
            const key = Array.isArray(navItem) ? navItem.map((n) => n.key).join(';') : navItem.key;
            return <NavItem item={navItem} key={key} />;
          })}
        </List>
      </div>
    </SwipeableDrawer>
  );
}

Nav.propTypes = {
  classes: PropTypes.object,
  menuSubject: SubjectPropTypes.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  routeNavItems: RouteNavItemsPropTypes.isRequired,
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
