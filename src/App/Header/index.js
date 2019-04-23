import React, { useCallback } from 'react';

import "./Header.css";
import MenuIcon from './baseline-menu-24px.svg';

export default function Header({ menuSubscription, children }) {

  const onToggleMenu = useCallback(() => menuSubscription.next());

  return (
    <header className="dashboard-header">
      <MenuIcon onClick={onToggleMenu} />
      {children}
    </header>
  );
}
