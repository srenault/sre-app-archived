import PropTypes from 'prop-types';

const FinanceClientPropTypes = PropTypes.shape({
  fetchAccount: PropTypes.func.isRequired,
  fetchAccountsOverview: PropTypes.func.isRequired,
});

export const ApiClientPropTypes = PropTypes.shape({
  finance: FinanceClientPropTypes.isRequired,
});

export default {
  ApiClientPropTypes,
};
