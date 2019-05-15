import React from 'react';

import Finance from './index';
import Main from '../Main';

export default function FinanceMain(props) {
  return <Main><Finance {...props} /></Main>;
}
