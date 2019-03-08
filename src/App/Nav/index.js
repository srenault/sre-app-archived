import React from 'react';
import { Link } from "react-router-dom";

import './Nav.css';

export default function Nav() {
  return (
    <aside className="dashboard-nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/money">Money</Link></li>
      </ul>
    </aside>
  );
}
