import React from 'react';
import { Link } from "react-router-dom";

import './Nav.css';
import HomeIcon from './baseline-home-24px.svg';
import FinanceIcon from './baseline-account_balance-24px.svg';

export default function Nav() {
  return (
    <aside className="dashboard-nav">
      <ul>
      <li><Link to="/"><HomeIcon /></Link></li>
        <li><Link to="/finance"><FinanceIcon /></Link></li>
      </ul>
    </aside>
  );
}
