import React, { useEffect, useCallback } from 'react';
import MonthlyConsumption from 'App/Energy/Electricity/MonthlyConsumption';
import LatestLoad from 'App/Energy/Electricity/LatestLoad';
import { withRefreshSubject } from 'App/Header';
import { SubjectPropTypes } from 'propTypes/rxjs';
import { AsyncStatePropTypes } from 'propTypes/react-async';
import PropTypes from 'prop-types';

function Electricity({ apiClient, refreshSubject, routePaths }) {
  return (
    <div className="electricity">
      <MonthlyConsumption apiClienty={apiClient} />
      <LatestLoad apiClient={apiClient} />
    </div>
  );
}

Electricity.propTypes = {
  asyncState: AsyncStatePropTypes.isRequired,
  routePaths: PropTypes.object.isRequired,
  refreshSubject: SubjectPropTypes.isRequired,
};

export default withRefreshSubject(Electricity);
