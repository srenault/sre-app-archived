import React, { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import Menu from 'react-burger-menu/lib/menus/slide';

import './Nav.css';

export default function Nav({ menuSubscription }) {
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  const toggleMenu = useCallback(() => setOpen(!open), []);

  const handleStateChange = useCallback((state) => setOpen(state.isOpen));

  useEffect(() => {
    const subscription = menuSubscription.subscribe({
      next: () => toggleMenu(),
    });
    return () => subscription.unsubscribe();
  });

  const styles = {
    bmMenuWrap: {
      transition: 'all 0.2s ease 0s',
    }
  };

  return (
    <Menu styles={styles} isOpen={open} onStateChange={handleStateChange} customBurgerIcon={false} width={'30%'} pageWrapId={ "app-wrap" } outerContainerId={ "app" }>
      <Link onClick={closeMenu} to="/">Home</Link>
      <Link onClick={closeMenu} to="/finance">Finance</Link>
    </Menu>
  );
}
