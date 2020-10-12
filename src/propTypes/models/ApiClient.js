import PropTypes from 'prop-types';

const FinanceClientPropTypes = PropTypes.shape({
  fetchAccount: PropTypes.func.isRequired,
  fetchAccountsOverview: PropTypes.func.isRequired,
});

const ReleasesClientPropTypes = PropTypes.shape({
  list: PropTypes.func.isRequired,
});

const EnergyClientPropTypes = PropTypes.shape({
  fetchElecticityConsumption: PropTypes.func.isRequired,
  fetchCurrentElectricityLoad: PropTypes.func.isRequired,
});

export const ApiClientPropTypes = PropTypes.shape({
  finance: FinanceClientPropTypes.isRequired,
  releases: ReleasesClientPropTypes.isRequired,
  energy: EnergyClientPropTypes,
});

export default {
  ApiClientPropTypes,
};
