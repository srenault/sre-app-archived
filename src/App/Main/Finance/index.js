import React from 'react';

import Balances from './Balances';

export default function Finance({ apiClient }) {

  return (
    <div className="finance">
      <Balances apiClient={apiClient} />
    </div>
  );
}
