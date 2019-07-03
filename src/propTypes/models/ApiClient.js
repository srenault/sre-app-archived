import PropTypes from 'prop-types';

const FinanceClientPropTypes = PropTypes.shape({
  fetchAccount: PropTypes.func.isRequired,
  fetchAccountsOverview: PropTypes.func.isRequired,
});

const ReleasesClientPropTypes = PropTypes.shape({
  list: PropTypes.func.isRequired,
});

export const ApiClientPropTypes = PropTypes.shape({
  finance: FinanceClientPropTypes.isRequired,
  releases: ReleasesClientPropTypes.isRequired,
});

export default {
  ApiClientPropTypes,
};
