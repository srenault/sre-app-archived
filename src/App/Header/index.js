import React, { useCallback } from 'react';

import "./Header.css";
import withStyles from '@material-ui/core/styles/withStyles';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshIcon from '@material-ui/icons/Refresh';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Subject } from 'rxjs';

const MenuSubject = new Subject();
const RefreshSubject = new Subject();

function Header({ classes, children, refresh }) {

  const onToggleMenu = useCallback(() => MenuSubject.next());
  const onRefresh = useCallback(() => RefreshSubject.next());

  return (
    <div className={classes.root}>
      <AppBar className="dashboard-header" position="fixed">
        <Toolbar>
          <IconButton onClick={onToggleMenu} color="inherit" aria-label="Menu" className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {children}
          </Typography>
          {
            refresh && (
              <IconButton onClick={onRefresh} color="inherit" aria-label="Refresh">
                <RefreshIcon />
              </IconButton>
            )
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export function withRefreshSubject(Component) {
  return (props) => <Component {...props} refreshSubject={RefreshSubject} />;
}

export function withMenuSubject(Component) {
  return (props) => <Component {...props} menuSubject={MenuSubject} />;
}

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export default withStyles(styles)(Header);
