import React from 'react';

import "./Header.css";

export default function Header(props) {

  return (
    <header className="dashboard-header">
      {props.children}
    </header>
  );
}
