import React, { useRef, useEffect, useState } from 'react';
import c3 from 'c3';
import Container from '@material-ui/core/Container';
import LastHour from './LastHour';
import LatestHours from './LatestHours';
import RealTime from './RealTime';
import Past from './Past';

export default function Load({ asyncState, apiClient }) {

  return (
    <Container>
      <RealTime apiClient={apiClient} />
      <Past apiClient={apiClient} />
    </Container>
  );
}
